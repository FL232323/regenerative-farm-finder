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
    coordinates: [number, number];  // [longitude, latitude] from MongoDB
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

const FarmList = ({ farms, title, onFarmClick, selectedFarm }: FarmListProps) => (
  <div className="h-full flex flex-col">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="flex-1 overflow-y-auto space-y-4">
      {farms.map((farm) => (
        <Card
          key={farm._id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md
            ${selectedFarm?._id === farm._id ? 'ring-2 ring-green-500' : ''}
          `}
          onClick={() => onFarmClick(farm)}
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

interface ThreeColumnLayoutProps {
  farms: Farm[];
  searchLocation?: [number, number];
}

// Convert MongoDB coordinates [longitude, latitude] to Leaflet [latitude, longitude]
function toLeafletCoordinates(coordinates: [number, number]): [number, number] {
  return [coordinates[1], coordinates[0]];
}

export default function ThreeColumnLayout({ farms, searchLocation }: ThreeColumnLayoutProps) {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    searchLocation ? toLeafletCoordinates(searchLocation) : [40.7128, -74.0060]
  );
  const [mapZoom, setMapZoom] = useState(searchLocation ? 11 : 9);

  const pickupFarms = farms.filter(farm => farm.deliveryOptions?.localPickup);
  const deliveryFarms = farms.filter(farm => farm.deliveryOptions?.delivery);

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarm(farm);
    setMapCenter(toLeafletCoordinates(farm.location.coordinates));
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