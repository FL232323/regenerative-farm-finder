'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SearchBox from '@/components/SearchBox';
import { FarmListing } from '@/components/FarmListing';

// Dynamically import Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse" />
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]); // US center
  const [mapZoom, setMapZoom] = useState(4);

  const handleSearch = (results: SearchResult[]) => {
    setSearchResults(results);
    setError(null);

    // If results exist, center map on first result
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
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Find Regenerative Farms Near You
          </h1>
          <p className="text-xl mb-8">
            Discover local sources for regeneratively farmed meats, dairy, and more
          </p>
          <SearchBox
            onSearch={handleSearch}
            onError={handleError}
            setIsLoading={setIsLoading}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto py-8 px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map - Always show */}
            <div className="lg:order-2 rounded-lg overflow-hidden shadow-lg bg-white">
              <Map
                farms={searchResults}
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>

            {/* Results List - Show only when there are results */}
            {searchResults.length > 0 ? (
              <div className="lg:order-1 space-y-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                </h2>
                {searchResults.map((farm) => (
                  <FarmListing
                    key={farm._id}
                    farm={farm}
                  />
                ))}
              </div>
            ) : (
              <div className="lg:order-1">
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Enter your zip code above to find regenerative farms in your area
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
