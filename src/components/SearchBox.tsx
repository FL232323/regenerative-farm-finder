'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBoxProps {
  onSearch: (results: any[]) => void;
  onError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function SearchBox({ onSearch, onError, setIsLoading }: SearchBoxProps) {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('50');
  const [type, setType] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zipCode) {
      onError('Please enter a zip code');
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        zipCode,
        radius,
        ...(type && { type })
      });

      const response = await fetch(`/api/farms/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error searching farms');
      }

      onSearch(data);
      
      // Update URL with search parameters
      router.push(`/?${params.toString()}`);
    } catch (error: any) {
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const businessTypes = [
    'Farm',
    'Grocery Store',
    'Farmers Market',
    'Restaurant',
    'Pickup Location'
  ];

  const radiusOptions = [
    '10',
    '25',
    '50',
    '100',
    '200'
  ];

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Zip Code Input */}
          <div className="flex-1">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="Enter zip code"
              pattern="[0-9]*"
              maxLength={5}
            />
          </div>

          {/* Radius Selection */}
          <div className="w-full md:w-1/4">
            <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
              Distance (miles)
            </label>
            <select
              id="radius"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              {radiusOptions.map((option) => (
                <option key={option} value={option}>
                  {option} miles
                </option>
              ))}
            </select>
          </div>

          {/* Business Type Selection */}
          <div className="w-full md:w-1/3">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Business Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Types</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Search Farms
        </button>
      </div>
    </form>
  );
}
