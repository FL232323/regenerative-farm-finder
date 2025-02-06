interface FarmListingProps {
  farm: {
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
    practices?: string[];
    website?: string;
    phone?: string;
    email?: string;
  };
}

export function FarmListing({ farm }: FarmListingProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{farm.name}</h3>
            <div className="text-sm text-gray-600 mt-1">
              {farm.businessType.join(', ')}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {typeof farm.distance === 'number' ? `${farm.distance.toFixed(1)} miles` : 'Distance unavailable'}
            </span>
          </div>
        </div>

        {/* Address */}
        {farm.address && (
          <div className="text-gray-600 text-sm mb-4">
            {farm.address.street && <div>{farm.address.street}</div>}
            <div>
              {[farm.address.city, farm.address.state, farm.address.zipCode]
                .filter(Boolean)
                .join(', ')}
            </div>
          </div>
        )}

        {/* Description */}
        {farm.description && (
          <p className="text-gray-700 mb-4">
            {farm.description.length > 200 
              ? `${farm.description.substring(0, 200)}...` 
              : farm.description}
          </p>
        )}

        {/* Practices */}
        {farm.practices && farm.practices.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Farming Practices:</h4>
            <div className="flex flex-wrap gap-2">
              {farm.practices.map((practice, index) => (
                <div 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {practice}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${farm.location.coordinates[1]},${farm.location.coordinates[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Get Directions
          </a>
          
          {farm.website && (
            <a
              href={farm.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}