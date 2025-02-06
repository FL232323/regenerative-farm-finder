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

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    console.log('MapController - New center:', center);
    console.log('MapController - New zoom:', zoom);
    
    if (map && center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      console.log('Setting map view to:', center);
      map.setView(center, zoom, {
        animate: true,
        duration: 0.5
      });
    } else {
      console.warn('Invalid map center or zoom:', { center, zoom });
    }
  }, [center, zoom, map]);
  
  return null;
}

const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];
const DEFAULT_ZOOM = 11;

export default function Map({ farms, center, zoom, selectedFarm, onMarkerClick }: MapProps) {
  console.log('Map component render:', { center, zoom, selectedFarm: selectedFarm?.name });

  const validCenter = center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])
    ? center
    : DEFAULT_CENTER;
  
  const validZoom = !isNaN(zoom) ? zoom : DEFAULT_ZOOM;

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={validCenter}
        zoom={validZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={validCenter} zoom={validZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {farms.map((farm) => {
          const coordinates: [number, number] = [
            farm.location.coordinates[1],
            farm.location.coordinates[0]
          ];
          
          console.log(`Marker for ${farm.name}:`, coordinates);
          
          return (
            <Marker 
              key={farm._id} 
              position={coordinates}
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