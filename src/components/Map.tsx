'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

interface Farm {
  _id: string;
  name: string;
  businessType: string[];
  location: {
    coordinates: [number, number];  // [longitude, latitude]
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
  center: [number, number];  // [latitude, longitude]
  zoom: number;
  selectedFarm?: Farm | null;
  onMarkerClick: (farm: Farm) => void;
}

// Helper function to convert coordinates
function toLeafletCoordinates(coordinates: [number, number]): [number, number] {
  // Convert from [longitude, latitude] to [latitude, longitude]
  return [coordinates[1], coordinates[0]];
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    console.log('MapController - New center:', center);
    console.log('MapController - New zoom:', zoom);
    
    if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      // No need to transform here as center should already be in [lat, lng]
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];  // [latitude, longitude]
const DEFAULT_ZOOM = 11;

export default function Map({ farms, center, zoom, selectedFarm, onMarkerClick }: MapProps) {
  console.log('Map render:', { center, zoom, selectedFarm: selectedFarm?.name });

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={center || DEFAULT_CENTER}
        zoom={zoom || DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={center || DEFAULT_CENTER} zoom={zoom || DEFAULT_ZOOM} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {farms.map((farm) => {
          // Convert coordinates for the marker
          const markerPosition = toLeafletCoordinates(farm.location.coordinates);
          console.log(`Marker position for ${farm.name}:`, markerPosition);
          
          return (
            <Marker 
              key={farm._id} 
              position={markerPosition}
              eventHandlers={{
                click: () => {
                  console.log('Marker clicked:', farm.name);
                  onMarkerClick(farm);
                }
              }}
            >
              <Popup>
                <div className="py-2">
                  <h3 className="font-bold text-lg mb-1">{farm.name}</h3>
                  {farm.businessType && (
                    <div className="text-sm text-gray-600 mb-2">
                      {farm.businessType.join(', ')}
                    </div>
                  )}
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
                      {farm.description}
                    </div>
                  )}
                  {farm.deliveryOptions?.deliveryDetails && (
                    <div className="mt-2 text-sm text-green-600">
                      {farm.deliveryOptions.deliveryDetails}
                    </div>
                  )}
                  {farm.deliveryOptions?.pickupDetails && (
                    <div className="mt-2 text-sm text-green-600">
                      {farm.deliveryOptions.pickupDetails}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}