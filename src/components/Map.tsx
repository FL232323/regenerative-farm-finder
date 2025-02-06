'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

interface Farm {
  _id: string;
  name: string;
  businessType: string[];
  location: {
    coordinates: [number, number];
  };
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  description?: string;
  distance?: number;
  deliveryOptions: {
    localPickup: boolean;
    delivery: boolean;
    deliveryRange?: number;
    pickupDetails?: string;
    deliveryDetails?: string;
  };
}

interface MapProps {
  farms: Farm[];
  center: [number, number];
  zoom: number;
  selectedFarm?: Farm | null;
  onMarkerClick: (farm: Farm) => void;
}

// Component to handle map center and zoom updates
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  
  return null;
}

// Default map center on New York City
const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];
const DEFAULT_ZOOM = 10;

export default function Map({ farms, center, zoom, selectedFarm, onMarkerClick }: MapProps) {
  const mapRef = useRef(null);

  // Ensure we have valid center and zoom, falling back to defaults if needed
  const mapCenter = center || DEFAULT_CENTER;
  const mapZoom = zoom || DEFAULT_ZOOM;

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <MapController center={mapCenter} zoom={mapZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {farms.map((farm) => (
          <Marker 
            key={farm._id} 
            position={[farm.location.coordinates[1], farm.location.coordinates[0]]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(farm);
                }
              }
            }}
          >
            <Popup className="min-w-[200px]">
              <div className="py-2">
                <h3 className="font-bold text-lg mb-1">{farm.name}</h3>
                
                <div className="text-sm text-gray-600 mb-2">
                  {farm.businessType.join(', ')}
                </div>
                
                {farm.address && (
                  <div className="text-sm mb-2">
                    {farm.address.street && <div>{farm.address.street}</div>}
                    <div>
                      {[farm.address.city, farm.address.state, farm.address.zipCode]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  </div>
                )}
                
                {typeof farm.distance === 'number' && (
                  <div className="text-sm text-gray-600">
                    {farm.distance.toFixed(1)} miles away
                  </div>
                )}
                
                {farm.description && (
                  <div className="mt-2 text-sm">
                    {farm.description.length > 150 
                      ? `${farm.description.substring(0, 150)}...` 
                      : farm.description}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}