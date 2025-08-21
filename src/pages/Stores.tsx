import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../services/api';
import { type Store } from '../types';
import StarRating from '../components/Star-rating';

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [submittingRating, setSubmittingRating] = useState<string | null>(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeAPI.getStores({
        search: search || undefined,
        sortBy,
        sortOrder,
      });
      setStores(response.stores);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const handleRatingSubmit = async (storeId: string, rating: number) => {
    try {
      setSubmittingRating(storeId);
      await ratingAPI.submitRating({ storeId, rating });
      
      // Update the store's rating in the local state
      setStores(prevStores =>
        prevStores.map(store =>
          store.id === storeId
            ? { ...store, userRating: rating }
            : store
        )
      );
      
      // Refresh stores to get updated average rating
      fetchStores();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(null);
    }
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading stores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Stores
            </label>
            <input
              type="text"
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSortChange('name')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'name'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSortChange('address')}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === 'address'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Address {sortBy === 'address' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Stores List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
                <p className="text-gray-600">{store.address}</p>
                <p className="text-sm text-gray-500">{store.email}</p>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overall Rating:</p>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={store.averageRating} readonly />
                    <span className="text-sm text-gray-500">
                      ({store.totalRatings} rating{store.totalRatings !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Your Rating:</p>
                  <StarRating
                    rating={store.userRating || 0}
                    onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                    readonly={submittingRating === store.id}
                  />
                  {submittingRating === store.id && (
                    <p className="text-xs text-blue-600 mt-1">Submitting rating...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found.</p>
        </div>
      )}
    </div>
  );
};

export default Stores;