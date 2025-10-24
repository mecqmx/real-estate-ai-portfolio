'use client';
import { useState } from 'react';
import { useLocale } from '../context/LocaleContext';

export default function GenerateDescriptionButton({ property = {}, onInsert }) {
  const { locale: siteLocale } = useLocale();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState(null);

  async function generate() {
    setError(null);
    setPreview('');
    setLoading(true);
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: property.title || '',
          price: property.price || '',
          beds: property.beds || '',
          baths: property.baths || '',
          area: property.area || '',
          features: property.features || [],
          // prefer explicit property.locale, otherwise site-wide selection
          locale: property.locale || siteLocale || 'en-US',
          browserLocale: typeof navigator !== 'undefined' ? navigator.language : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Generation failed');
      setPreview(data.description || '');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="inline-flex items-center px-3 py-1.5 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-60"
        onClick={generate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate description'}
      </button>

      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {preview ? (
        <div className="p-3 border rounded bg-gray-50">
          <h4 className="font-semibold mb-1">Preview</h4>
          <textarea
            className="w-full p-2 border rounded h-32 text-sm"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                onInsert && onInsert(preview);
                setPreview('');
              }}
            >
              Accept & Insert
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setPreview('')}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}