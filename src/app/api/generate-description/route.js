import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * In-memory store for rate limiting and caching.
 * NOTE: In a production serverless environment, this would be replaced
 * with a persistent store like Redis (e.g., Upstash) to share state
 * across multiple function instances.
 */
const lib = {
  RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  RATE_LIMIT_MAX: 20, // requests per window per IP
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  rateMap: new Map(),
  cacheMap: new Map(),
  getIp: (headers) =>
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown',
  rateLimit: (ip) => {
    const now = Date.now();
    const entry = lib.rateMap.get(ip) || { count: 0, firstTs: now };
    if (now - entry.firstTs > lib.RATE_LIMIT_WINDOW_MS) {
      lib.rateMap.set(ip, { count: 1, firstTs: now });
      return { allowed: true, remaining: lib.RATE_LIMIT_MAX - 1 };
    }
    if (entry.count >= lib.RATE_LIMIT_MAX) {
      return { allowed: false, remaining: 0 };
    }

    entry.count += 1;
    lib.rateMap.set(ip, entry);
    return { allowed: true, remaining: lib.RATE_LIMIT_MAX - entry.count };
  },

  getCache: (key) => {
    const entry = lib.cacheMap.get(key);
    if (!entry || Date.now() - entry.ts > lib.CACHE_TTL_MS) {
      if (entry) lib.cacheMap.delete(key);
      return null;
    }
    return entry.value;
  },

  setCache: (key, value) => {
    lib.cacheMap.set(key, { value, ts: Date.now() });
  },

  formatPrice: (price, locale) => {
    try {
      if (price === null || price === undefined) return '';
      const num = Number(price);
      if (Number.isNaN(num)) return String(price);
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(num);
    } catch {
      return String(price);
    }
  },

  fallbackDescription: ({ title, price, beds, baths, area, features = [], locale }) => {
    const formattedPrice = lib.formatPrice(price, locale);
    let description = `${title}.`;
    if (area) description += ` This ${area} sqm property`;
    if (beds || baths) description += ` features ${beds || 0} bed(s) and ${baths || 0} bath(s).`;
    if (formattedPrice) description += ` Price: ${formattedPrice}.`;
    if (features.length > 0) description += ` Key features include: ${features.join(', ')}.`;

    return description;
  },
};

export async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
  try {
    const ip = lib.getIp(req.headers);
    const rl = lib.rateLimit(ip);
    if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const body = await req.json();
    if (!body || !body.title) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const cacheKey = JSON.stringify(body);
    const cached = lib.getCache(cacheKey);
    if (cached) return NextResponse.json({ description: cached, cached: true });

    // Forcing English as requested, removing language detection.
    const inferredLocale = 'en-US';
    const formattedPrice = lib.formatPrice(body.price, inferredLocale);

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      console.warn('LLM API key not found. Using fallback description.');
      const desc = lib.fallbackDescription({ ...body, locale: inferredLocale });
      lib.setCache(cacheKey, desc);
      return NextResponse.json({ description: desc, fallback: true });
    }

    // Simplified prompt to generate a description directly.
    const prompt = `You are a professional real estate copywriter. Your task is to generate an engaging property description in English based on the data provided below.

Follow these rules:
1. If the 'Operation' is "Rent", emphasize the benefits of renting.
2. If the 'Operation' is "Sale", emphasize the value of buying.
3. If a 'Location' is provided, naturally weave in its benefits and use a communication style that feels local and culturally aware.
4. Mention the 'Type' of property naturally within the description.
5. Keep the description concise but engaging.
6. End with a clear call to action, inviting the reader to book an inspection.
7. VERY IMPORTANT: Generate only the description text. Do not include any extra formatting, labels, titles, or JSON.

---
PROPERTY DATA:
Title: ${body.title}
Operation: ${body.operation || 'Sale'}
Location: ${body.location}
Type: ${body.type}
Price: ${formattedPrice}
Details: ${body.beds || 'N/A'} beds, ${body.baths || 'N/A'} baths, ${body.area || 'N/A'} sqm.
Features: ${(body.features || []).join(', ') || 'None'}
---
DESCRIPTION:`;

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    if (!content) {
      console.error('Gemini error: No content in response');
      return NextResponse.json({ error: 'LLM error' }, { status: 502 });
    }

    const description = content.replace(/["*]/g, '').trim();

    if (!description) {
      const desc = lib.fallbackDescription({ ...body, locale: inferredLocale });
      lib.setCache(cacheKey, desc);
      return NextResponse.json({ description: desc, fallback: true });
    }

    lib.setCache(cacheKey, description);
    return NextResponse.json({ description, remaining: rl.remaining });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}