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
    products?: Array<{
      category: string;
      items: Array<{
        name: string;
        availability: string;
      }>;
    }>;
    operatingHours?: Array<{
      day: string;
      open: string;
      close: string;
    }>;
    scheduledTimes?: Array<{
      day: string;
      time: string;
      notes?: string;
    }>;
    shippingOptions?: {
      offersShipping: boolean;
      radius?: number;
      minimumOrder?: number;
      shippingNotes?: string;
    };
    distance: number;
    images?: Array<{
      url: string;
      caption: string;
    }>;
  };
}

export function FarmListing({ farm }: FarmListingProps) {
  const isShippingProvider = farm.shippingOptions?.offersShipping;
  const formattedHours = farm.operatingHours?.map(h => 
    `${h.day}: ${h.open} - ${h.close}`
  ).join(', ');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{farm.name}</h3>
            <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span>{farm.businessType.join(', ')}</span>
              {isShippingProvider && (
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  Ships
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-block ${isShippingProvider ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} text-sm font-medium px-2.5 py-0.5 rounded`}>
              {farm.distance.toFixed(1)} miles
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

        {/* Hours or Scheduled Times */}
        {(formattedHours || farm.scheduledTimes) && (
          <div className="mb-4">
            {formattedHours && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Hours:</span> {formattedHours}
              </div>
            )}
            {farm.scheduledTimes && farm.scheduledTimes.length > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Schedule:</span>
                {farm.scheduledTimes.map((time, index) => (
                  <div key={index} className="ml-2">
                    {time.day}: {time.time}
                    {time.notes && <span className="text-gray-500"> ({time.notes})</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {farm.products && farm.products.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Products:</h4>
            <div className="flex flex-wrap gap-2">
              {farm.products.map((product, index) => (
                <div 
                  key={`${product.category}-${index}`}
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {product.category}
                  {product.items && product.items.length > 0 && (
                    <span className="text-gray-500">
                      {' '}({product.items.length} items)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping Information */}
        {isShippingProvider && farm.shippingOptions && (
          <div className="mb-4 text-sm text-gray-600">
            {farm.shippingOptions.radius && (
              <div>
                <span className="font-medium">Shipping Radius:</span> Up to {farm.shippingOptions.radius} miles
              </div>
            )}
            {farm.shippingOptions.minimumOrder && (
              <div>
                <span className="font-medium">Minimum Order:</span> ${farm.shippingOptions.minimumOrder}
              </div>
            )}
            {farm.shippingOptions.shippingNotes && (
              <div className="mt-1 text-gray-500">
                {farm.shippingOptions.shippingNotes}
              </div>
            )}
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
          
          <button
            onClick={() => {
              // TODO: Implement "View Details" functionality
            }}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}