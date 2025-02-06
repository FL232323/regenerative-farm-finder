'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBoxProps {
  onSearch: (results: any[], location: [number, number]) => void;
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

      // Log the raw data for debugging
      console.log('API Response Data:', data);

      // Instead of using the first farm's coordinates, get them from the API response
      const zipLocation = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=USA&format=json&limit=1`
      ).then(r => r.json());

      const location: [number, number] = zipLocation.length > 0
        ? [parseFloat(zipLocation[0].lat), parseFloat(zipLocation[0].lon)]
        : [39.8283, -98.5795];

      console.log('Using location:', location);
      
      onSearch(data, location);
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

  const radiusOptions = ['10', '25', '50', '100', '200'];

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-600 mb-1">
            Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
            placeholder="Enter zip code"
            pattern="[0-9]*"
            maxLength={5}
          />
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="radius" className="block text-sm font-medium text-gray-600 mb-1">
            Distance
          </label>
          <select
            id="radius"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none"
          >
            {radiusOptions.map((option) => (
              <option key={option} value={option}>
                {option} miles
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/3">
          <label htmlFor="type" className="block text-sm font-medium text-gray-600 mb-1">
            Business Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none"
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

      <button
        type="submit"
        className="mt-4 w-full md:w-auto px-8 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        Search Farms
      </button>
    </form>
  );
}