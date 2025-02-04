import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, MapPin, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const RegenerativeFarmFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [center] = useState([40.7128, -74.0060]); // Default to NYC

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Regenerative Farm Finder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Enter your location or zip code"
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
          <div className="h-96 rounded-lg mb-4">
            <MapContainer 
              center={center} 
              zoom={13} 
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <Marker position={center}>
                <Popup>
                  Your Location
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <FarmListing />
        </CardContent>
      </Card>
    </div>
  );
};

const FarmListing = () => (
  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold">Force of Nature</h3>
        <p className="text-sm text-gray-600">100% Grass-fed Regenerative Beef</p>
        <div className="mt-2 flex gap-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            Verified Regenerative
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            Ships Nationwide
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm text-gray-600">Distance:</span>
        <p className="font-bold">12 miles</p>
      </div>
    </div>
  </div>
);

export default RegenerativeFarmFinder;