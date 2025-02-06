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
    coordinates: [number, number];  // [longitude, latitude] from MongoDB
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

// Convert MongoDB coordinates [longitude, latitude] to Leaflet [latitude, longitude]
function toLeafletCoordinates(coordinates: [number, number]): [number, number] {
  return [coordinates[1], coordinates[0]];
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center && center.length === 2) {
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5
      });
    }
  }, [center, zoom, map]);
  
  return null;
}

const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];
const DEFAULT_ZOOM = 11;

export default function Map({ farms, center, zoom, selectedFarm, onMarkerClick }: MapProps) {
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
          // Always convert from MongoDB format to Leaflet format
          const markerPosition = toLeafletCoordinates(farm.location.coordinates);
          
          return (
            <Marker 
              key={farm._id} 
              position={markerPosition}
              eventHandlers={{
                click: () => onMarkerClick(farm)
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