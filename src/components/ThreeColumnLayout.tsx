import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
});

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
  distance: number;
  deliveryOptions: {
    localPickup: boolean;
    delivery: boolean;
    deliveryRange?: number;
    pickupDetails?: string;
    deliveryDetails?: string;
  };
}

interface FarmListProps {
  farms: Farm[];
  title: string;
  onFarmClick: (farm: Farm) => void;
  selectedFarm?: Farm | null;
}

const FarmList = ({ farms, title, onFarmClick, selectedFarm }: FarmListProps) => {
  const handleFarmClick = (farm: Farm) => {
    console.log('Farm clicked in FarmList:', {
      name: farm.name,
      coordinates: farm.location.coordinates,
      type: farm.deliveryOptions.localPickup ? 'pickup' : 'delivery'
    });
    onFarmClick(farm);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="flex-1 overflow-y-auto space-y-4">
        {farms.map((farm) => (
          <Card
            key={farm._id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md
              ${selectedFarm?._id === farm._id ? 'ring-2 ring-green-500' : ''}
            `}
            onClick={() => handleFarmClick(farm)}
          >
            <h3 className="font-semibold text-lg">{farm.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {farm.distance.toFixed(1)} miles away
            </p>
            {farm.address && (
              <p className="text-sm text-gray-600 mt-1">
                {[farm.address.city, farm.address.state].filter(Boolean).join(', ')}
              </p>
            )}
            {farm.deliveryOptions?.pickupDetails && (
              <p className="text-sm text-green-600 mt-2">
                {farm.deliveryOptions.pickupDetails}
              </p>
            )}
            {farm.deliveryOptions?.deliveryDetails && (
              <p className="text-sm text-green-600 mt-2">
                {farm.deliveryOptions.deliveryDetails}
              </p>
            )}
          </Card>
        ))}
        {farms.length === 0 && (
          <p className="text-gray-500 text-center py-4">No farms found</p>
        )}
      </div>
    </div>
  );
};

interface ThreeColumnLayoutProps {
  farms: Farm[];
  searchLocation?: [number, number];
}

const DEFAULT_CENTER: [number, number] = [40.7128, -74.0060];  // [latitude, longitude]

export default function ThreeColumnLayout({ farms, searchLocation }: ThreeColumnLayoutProps) {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(searchLocation || DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(searchLocation ? 11 : 9);

  const pickupFarms = farms.filter(farm => farm.deliveryOptions?.localPickup);
  const deliveryFarms = farms.filter(farm => farm.deliveryOptions?.delivery);

  console.log('Current farms state:', {
    total: farms.length,
    pickup: pickupFarms.length,
    delivery: deliveryFarms.length
  });

  const handleFarmClick = (farm: Farm) => {
    console.log('handleFarmClick called with:', {
      name: farm.name,
      coordinates: farm.location.coordinates,
      currentCenter: mapCenter,
      currentZoom: mapZoom
    });

    if (!farm.location?.coordinates || farm.location.coordinates.length !== 2) {
      console.error('Invalid coordinates for farm:', farm.name);
      return;
    }

    // Convert from [longitude, latitude] to [latitude, longitude]
    const [longitude, latitude] = farm.location.coordinates;
    const newCenter: [number, number] = [latitude, longitude];
    
    console.log('Setting new map center:', newCenter);

    setSelectedFarm(farm);
    setMapCenter(newCenter);
    setMapZoom(13);
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-7 gap-4 p-4">
      {/* Local Pickup Column */}
      <div className="lg:col-span-2 h-[600px] lg:h-auto overflow-hidden">
        <Card className="h-full p-4">
          <FarmList
            farms={pickupFarms}
            title="Local Pickup"
            onFarmClick={handleFarmClick}
            selectedFarm={selectedFarm}
          />
        </Card>
      </div>

      {/* Map Column */}
      <div className="lg:col-span-3 h-[600px] lg:h-auto">
        <Card className="h-full">
          <Map
            farms={farms}
            center={mapCenter}
            zoom={mapZoom}
            selectedFarm={selectedFarm}
            onMarkerClick={handleFarmClick}
          />
        </Card>
      </div>

      {/* Delivery Column */}
      <div className="lg:col-span-2 h-[600px] lg:h-auto overflow-hidden">
        <Card className="h-full p-4">
          <FarmList
            farms={deliveryFarms}
            title="Delivery Available"
            onFarmClick={handleFarmClick}
            selectedFarm={selectedFarm}
          />
        </Card>
      </div>
    </div>
  );
}