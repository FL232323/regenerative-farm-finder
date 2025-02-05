'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBox from '@/components/SearchBox';
import { FarmListing } from '@/components/FarmListing';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-lg" />
});

interface SearchResult {
  _id: string;
  name: string;
  businessType: string[];
  location: {
    coordinates: [number, number];
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  products: Array<{
    category: string;
    items: Array<{
      name: string;
      availability: string;
    }>;
  }>;
  distance: number;
  images?: Array<{
    url: string;
    caption: string;
  }>;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [mapZoom, setMapZoom] = useState(4);

  const handleSearch = (results: SearchResult[]) => {
    setSearchResults(results);
    setError(null);
    if (results.length > 0) {
      const [lng, lat] = results[0].location.coordinates;
      setMapCenter([lat, lng]);
      setMapZoom(10);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSearchResults([]);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-green-700 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Find Regenerative Farms Near You
            </h1>
            <p className="text-xl text-green-50 mb-8">
              Discover local sources for regeneratively farmed meats, dairy, and more
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 transform translate-y-6">
            <SearchBox
              onSearch={handleSearch}
              onError={handleError}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Results List */}
            <div className="lg:order-1">
              {searchResults.length > 0 ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                  </h2>
                  <div className="space-y-4">
                    {searchResults.map((farm) => (
                      <FarmListing
                        key={farm._id}
                        farm={farm}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg">
                    Enter your zip code above to find regenerative farms in your area
                  </p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-lg bg-white h-[600px]">
                <Map
                  farms={searchResults}
                  center={mapCenter}
                  zoom={mapZoom}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
