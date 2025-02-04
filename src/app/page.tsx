'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  const [zipCode, setZipCode] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Regenerative Farm Finder</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-xl">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter zip code"
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(true)}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Filters
          </button>
        </div>

        <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
          <Map />
        </div>
      </div>
    </main>
  );
}