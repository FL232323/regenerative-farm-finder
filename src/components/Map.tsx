'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";

// ... (previous interfaces)

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (map && center && center.length === 2) {
      console.log('Map bounds:', map.getBounds());
      console.log('Setting map center to:', center);
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
          const markerPosition: [number, number] = [farm.location.coordinates[1], farm.location.coordinates[0]];
          console.log(`Marker position for ${farm.name}:`, markerPosition);
          
          return (
            <Marker 
              key={farm._id} 
              position={markerPosition}
              eventHandlers={{
                click: () => onMarkerClick(farm)
              }}
            >
              {/* ... rest of Marker component */}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}