"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

// Temporary type for farm data
interface Farm {
  _id?: string;
  name: string;
  location: {
    coordinates: [number, number];
  };
  description?: string;
  practices?: string[];
  products?: string[];
}

export default function Map() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default center of the map (can be changed later)
  const defaultCenter: [number, number] = [39.8283, -98.5795]; // Geographical center of the USA
  const defaultZoom = 4;

  useEffect(() => {
    // Placeholder for future database fetch
    const fetchFarms = async () => {
      try {
        // In the future, this will be an actual API call to your backend
        const mockFarms: Farm[] = [
          {
            _id: '1',
            name: 'Sample Regenerative Farm',
            location: {
              coordinates: [-98.5795, 39.8283]
            },
            description: 'A sample regenerative farm in the center of the USA',
            practices: ['Crop Rotation', 'No-Till Farming'],
            products: ['Organic Vegetables', 'Grass-Fed Beef']
          }
        ];
        
        setFarms(mockFarms);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch farms');
        setIsLoading(false);
      }
    };

    fetchFarms();
  }, []);

  if (isLoading) return <div>Loading farms...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={defaultZoom} 
      scrollWheelZoom={true}
      className="h-[500px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {farms.map((farm) => (
        <Marker 
          key={farm._id} 
          position={[farm.location.coordinates[1], farm.location.coordinates[0]]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{farm.name}</h3>
              {farm.description && <p>{farm.description}</p>}
              {farm.practices && (
                <div>
                  <strong>Practices:</strong>
                  <ul>
                    {farm.practices.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
              )}
              {farm.products && (
                <div>
                  <strong>Products:</strong>
                  <ul>
                    {farm.products.map((product, index) => (
                      <li key={index}>{product}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
