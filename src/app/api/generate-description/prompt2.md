You are a professional real estate copywriter. Your task is to generate an engaging property description in English based on the data provided below.

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
DESCRIPTION:
3. Update the API Route to Handle Prompt Switching
Finally, I'll modify the generate-description/route.js file. It will now read the prompt templates from the files and use a promptType parameter from the request body to decide which one to use.

route.js
-25
+14
 Show full code block 
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

/**
 * In-memory store for rate limiting and caching.
    const rl = lib.rateLimit(ip);
    if (!rl.allowed) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });

    const body = await req.json();
    if (!body || !body.title) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const { promptType = 'basic', ...body } = await req.json();
    if (!body || !body.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
      const desc = lib.fallbackDescription({ ...body, locale: inferredLocale, beds: body.beds, baths: body.baths, area: body.area, features: body.features });
      lib.setCache(cacheKey, desc);
      return NextResponse.json({ description: desc, fallback: true });
    }

    // Simplified prompt to generate a description directly.
    const prompt = `You are a professional real estate copywriter. Your task is to generate an engaging property description in English based on the data provided below.
    // Determine which prompt file to use
    const promptFileName = promptType === 'advanced' ? 'Advanced_CoT_Prompt.txt' : 'Basic_Prompt.txt';
    const promptTemplatePath = path.join(process.cwd(), 'src', 'app', 'api', 'generate-description', promptFileName);
    const promptTemplate = fs.readFileSync(promptTemplatePath, 'utf-8');

Follow these rules:
1. If the 'Operation' is "Rent", emphasize the benefits of renting.
2. If the 'Operation' is "Sale", emphasize the value of buying.
3. If a 'Location' is provided, naturally weave in its benefits and use a communication style that feels local and culturally aware.
4. Mention the 'Type' of property naturally within the description.
5. Keep the description concise but engaging.
6. End with a clear call to action, inviting the reader to book an inspection.
7. VERY IMPORTANT: Generate only the description text. Do not include any extra formatting, labels, titles, or JSON.

----
PROPERTY DATA:
Title: ${body.title}
Operation: ${body.operation || 'Sale'}
Location: ${body.location}
Type: ${body.type}
Price: ${formattedPrice}
Details: ${body.beds || 'N/A'} beds, ${body.baths || 'N/A'} baths, ${body.area || 'N/A'} sqm.
Features: ${(body.features || []).join(', ') || 'None'}
----
DESCRIPTION:`;
    // Interpolate variables into the chosen prompt template
    const prompt = eval('`' + promptTemplate + '`');

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const description = content.replace(/["*]/g, '').trim();

    if (!description) {
      const desc = lib.fallbackDescription({ ...body, locale: inferredLocale });
      const desc = lib.fallbackDescription({ ...body, locale: inferredLocale, beds: body.beds, baths: body.baths, area: body.area, features: body.features });
      lib.setCache(cacheKey, desc);
      return NextResponse.json({ description: desc, fallback: true });
    }

How to Use It
Your backend is now ready. To use the new prompt, you'll need to update your frontend code.

Add a Toggle: In the UI where you have the "Generate Description" button (likely on the property creation/edit page), add a toggle switch, a dropdown, or a set of radio buttons.

Manage State: Use a state variable (e.g., const [promptType, setPromptType] = useState('basic')) to track the user's selection.

Update the API Call: When you make the fetch request to /api/generate-description, include the selected prompt type in the request body:

javascript
 Show full code block 
// Example frontend fetch call
const response = await fetch('/api/generate-description', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    promptType: promptType, // 'basic' or 'advanced'
    title: property.title,
    // ... other property data
  }),
});
This setup gives you a flexible way to test and compare different prompt engineering techniques directly within your application.

Generated by: 2.5 Pro
