// src/components/properties/InspectionRequestForm.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function InspectionRequestForm({ propertyId }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pre-fill form with session data when available
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (status !== 'authenticated') {
      setError('You must be logged in to submit a request. Redirecting to sign in...');
      setIsLoading(false);
      setTimeout(() => router.push('/auth/signin'), 2000);
      return;
    }

    try {
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong.');
      }

      setSuccess('Your inspection request has been sent successfully! The agent will contact you shortly.');
      // Clear only the fields the user is likely to change for a new request
      setFormData((prev) => ({ ...prev, preferredDate: '', message: '', phone: '' })); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the form if the session is still loading
  if (status === 'loading') {
    return <p className="text-center p-4">Loading form...</p>;
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Request an Inspection</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">Preferred Date & Time</label>
                <input type="datetime-local" id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
          <textarea id="message" name="message" rows="3" value={formData.message} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}

        <div>
          <button type="submit" disabled={isLoading || status !== 'authenticated'} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
            {isLoading ? 'Sending Request...' : 'Submit Request'}
          </button>
          {status !== 'authenticated' && (
            <p className="text-sm text-center text-gray-600 mt-2">
              You must be signed in to request an inspection.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
