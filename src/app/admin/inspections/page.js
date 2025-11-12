// src/app/admin/inspections/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminInspectionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inspections, setInspections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [inspectionToEdit, setInspectionToEdit] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not authenticated or not an authorized role
  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['AGENT', 'ADMIN'].includes(session.user?.role)) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  // Function to fetch inspection requests
  const fetchInspections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/inspections');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInspections(data);
    } catch (err) {
      console.error("Failed to fetch inspection requests:", err);
      setError(err.message || 'Failed to load requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (status === 'authenticated' && ['AGENT', 'ADMIN'].includes(session.user?.role)) {
      fetchInspections();
    }
  }, [session, status]);

  // --- Edit Status Logic ---
  const handleEditClick = (inspection) => {
    setInspectionToEdit(inspection);
    setNewStatus(inspection.status);
    setShowStatusModal(true);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const confirmStatusUpdate = async () => {
    if (!inspectionToEdit || !newStatus) return;

    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch(`/api/inspections/${inspectionToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status.');
      }

      // Update the inspection's status in the local state
      setInspections(prev => prev.map(insp =>
        insp.id === inspectionToEdit.id ? { ...insp, status: newStatus } : insp
      ));
      console.log(`Inspection ${inspectionToEdit.id} status updated to .`);
    } catch (err) {
      console.error("Error updating inspection status:", err);
      setError(err.message);
    } finally {
      setIsUpdating(false);
      setShowStatusModal(false);
      setInspectionToEdit(null);
    }
  };

  const cancelEdit = () => {
    setShowStatusModal(false);
    setInspectionToEdit(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMED': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-blue-600 bg-blue-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (status === 'loading' || isLoading) {
    return <p className="text-center text-blue-600 p-8 text-lg">Loading inspection requests...</p>;
  }

  if (!session || !['AGENT', 'ADMIN'].includes(session.user?.role)) {
    return null; // Or a more explicit "access denied" message
  }

  return (
    <main className="p-4 max-w-5xl mx-auto bg-white shadow-lg rounded-lg my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Inspection Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {inspections.length === 0 ? (
        <p className="text-center text-gray-600">No inspection requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Property</th>
                <th className="py-3 px-6 text-left">Client</th>
                <th className="py-3 px-6 text-left">Preferred Date</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {inspections.map((req) => (
                <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <Link href={`/properties/${req.propertyId}`} className="text-blue-600 hover:underline">
                      {req.property.title}
                    </Link>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex flex-col">
                      {req.client ? (
                        <>
                          <span>{req.client.name}</span>
                          <span className="text-gray-500 text-xs">{req.client.email}</span>
                        </>
                      ) : (
                        <>
                          <span>{req.name} <span className="text-xs font-normal text-gray-500">(Guest)</span></span>
                          <span className="text-gray-500 text-xs">{req.email}</span>
                        </>
                      )}
                      {req.phone && <span className="text-gray-500 text-xs mt-1">Tel: {req.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{new Date(req.preferredDate).toLocaleString()}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleEditClick(req)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-200"
                      disabled={isUpdating}
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Status Modal */}
      {showStatusModal && inspectionToEdit && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Update Inspection Status</h3>
            <div className="mb-4">
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-2">New Status:</label>
              <select
                id="newStatus"
                name="newStatus"
                value={newStatus}
                onChange={handleStatusChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                disabled={isUpdating}
              >
                {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={cancelEdit} disabled={isUpdating} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">
                Cancel
              </button>
              <button onClick={confirmStatusUpdate} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
