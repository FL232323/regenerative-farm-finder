import React from 'react';

interface Farm {
  id: string;
  name: string;
  description: string;
  distance: number;
  tags: string[];
}

interface FarmListingProps {
  className?: string;
}

const SAMPLE_FARMS: Farm[] = [
  {
    id: '1',
    name: 'Force of Nature',
    description: '100% Grass-fed Regenerative Beef',
    distance: 12,
    tags: ['Verified Regenerative', 'Ships Nationwide']
  },
  {
    id: '2',
    name: 'Green Pastures Farm',
    description: 'Organic Vegetables & Free Range Eggs',
    distance: 5,
    tags: ['Organic Certified', 'Local Pickup']
  }
];

const FarmListing: React.FC<FarmListingProps> = ({ className = '' }) => {
  return (
    <div className="space-y-4">
      {SAMPLE_FARMS.map((farm) => (
        <div 
          key={farm.id}
          className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${className}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{farm.name}</h3>
              <p className="text-sm text-gray-600">{farm.description}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {farm.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">Distance:</span>
              <p className="font-bold">{farm.distance} miles</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FarmListing; 