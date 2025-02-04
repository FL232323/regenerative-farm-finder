import React, { useState } from 'react';
import Map from './components/Map';
import SearchFilters from './components/SearchFilters';
import LocationDetails from './components/LocationDetails';
import useLocationSearch from './hooks/useLocationSearch';

function App() {
  const [zipCode, setZipCode] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    type: null,
    certifications: [],
    radius: 50
  });

  const { 
    locations, 
    loading, 
    error, 
    center 
  } = useLocationSearch(zipCode, filters.radius, filters.type);

  // Filter locations based on certifications
  const filteredLocations = locations.filter(location => {
    if (filters.certifications.length === 0) return true;
    return location.certifications?.some(cert => 
      filters.certifications.includes(cert)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {loading && (
          <div className="text-center py-4">Loading...</div>
        )}

        {error && (
          <div className="text-center py-4 text-red-600">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Map
              locations={filteredLocations}
              center={center}
              zoom={center ? 10 : 4}
              onLocationSelect={setSelectedLocation}
            />
          </div>
          
          <div>
            {selectedLocation && (
              <LocationDetails location={selectedLocation} />
            )}
          </div>
        </div>

        <SearchFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </div>
  );
}

export default App;