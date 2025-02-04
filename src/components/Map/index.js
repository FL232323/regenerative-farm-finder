import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

// Custom marker icons for different location types
const createCustomIcon = (type) => {
  const iconColors = {
    farm: '#4CAF50',
    store: '#2196F3',
    restaurant: '#FF9800'
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${iconColors[type]}; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25]
  });
};

const Map = ({ locations, center, zoom }) => {
  const [mapCenter, setMapCenter] = useState(center || [39.8283, -98.5795]); // USA center
  const [mapZoom, setMapZoom] = useState(zoom || 4);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {locations?.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.type)}
          >
            <Popup>
              <div>
                <h3>{location.name}</h3>
                <p>{location.type.charAt(0).toUpperCase() + location.type.slice(1)}</p>
                <p>{location.address}</p>
                {location.certifications?.length > 0 && (
                  <p>Certifications: {location.certifications.join(', ')}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;