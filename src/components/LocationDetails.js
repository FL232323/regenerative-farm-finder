import React from 'react';

const LocationDetails = ({ location }) => {
  if (!location) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{location.name}</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">
          {location.address.street}<br />
          {location.address.city}, {location.address.state} {location.address.zipCode}
        </p>
      </div>

      {location.certifications?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Certifications</h3>
          <div className="flex gap-2">
            {location.certifications.map(cert => (
              <span 
                key={cert}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {location.products?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Products</h3>
          <div className="grid grid-cols-2 gap-2">
            {location.products.map(product => (
              <div 
                key={product.name}
                className="flex items-center gap-2"
              >
                <span>{product.name}</span>
                {product.seasonal && (
                  <span className="text-xs text-orange-600">(Seasonal)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {location.hours && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Hours</h3>
          <div className="grid grid-cols-2 gap-x-4 text-sm">
            {Object.entries(location.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="capitalize">{day}:</span>
                <span>{hours || 'Closed'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {location.contact && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold mb-2">Contact</h3>
          {location.contact.phone && (
            <p className="mb-1">
              <span className="font-medium">Phone:</span> {location.contact.phone}
            </p>
          )}
          {location.contact.email && (
            <p className="mb-1">
              <span className="font-medium">Email:</span> {location.contact.email}
            </p>
          )}
          {location.contact.website && (
            <p className="mb-1">
              <span className="font-medium">Website:</span>{' '}
              <a 
                href={location.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {location.contact.website}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationDetails;