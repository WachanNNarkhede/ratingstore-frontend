import React, { useState, useEffect } from 'react';
import { storeAPI } from '../services/api';
import { type StoreDetails } from '../types';
import StarRating from '../components/Star-rating';

const MyStore: React.FC = () => {
  const [store, setStore] = useState<StoreDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        setLoading(true);
        const response = await storeAPI.getMyStore();
        setStore(response.store);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch store details');
      } finally {
        setLoading(false);
      }
    };

    fetchMyStore();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading store details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No store found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Store Dashboard</h1>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{store.name}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><strong>Email:</strong> {store.email}</p>
            <p><strong>Address:</strong> {store.address}</p>
          </div>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Average Rating:</p>
              <StarRating rating={store.averageRating} readonly size="lg" />
            </div>
            <p><strong>Total Ratings:</strong> {store.totalRatings}</p>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Customer Ratings ({store.ratings.length})
        </h3>
        
        {store.ratings.length > 0 ? (
          <div className="space-y-4">
            {store.ratings.map((rating) => (
              <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">{rating.user.name}</p>
                    <p className="text-sm text-gray-600">{rating.user.email}</p>
                    <StarRating rating={rating.rating} readonly />
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No ratings yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyStore;