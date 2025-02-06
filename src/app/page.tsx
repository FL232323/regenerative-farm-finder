'use client';

import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import ThreeColumnLayout from '@/components/ThreeColumnLayout';

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);

  const handleSearch = async (results, location) => {
    setSearchResults(results);
    setSearchLocation(location);
    setError(null);
  };

  const handleError = (errorMessage) => {
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
      <section className="h-[calc(100vh-20rem)] mt-16">
        {error && (
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700" />
          </div>
        ) : searchResults.length > 0 ? (
          <ThreeColumnLayout 
            farms={searchResults}
            searchLocation={searchLocation}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 py-12">
            Enter your zip code above to find regenerative farms in your area
          </div>
        )}
      </section>
    </main>
  );
}