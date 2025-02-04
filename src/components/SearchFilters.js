import React from 'react';
import { Dialog } from '@/components/ui/dialog';

const SearchFilters = ({ 
  isOpen,
  onClose,
  filters,
  onFiltersChange
}) => {
  const handleTypeChange = (type) => {
    onFiltersChange({
      ...filters,
      type: filters.type === type ? null : type
    });
  };

  const handleCertificationChange = (cert) => {
    const newCertifications = filters.certifications.includes(cert)
      ? filters.certifications.filter(c => c !== cert)
      : [...filters.certifications, cert];
    
    onFiltersChange({
      ...filters,
      certifications: newCertifications
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2">Location Type</h3>
          <div className="space-y-2">
            {['farm', 'store', 'restaurant'].map(type => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`w-full px-3 py-2 text-left rounded-md ${filters.type === type ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Certifications</h3>
          <div className="space-y-2">
            {['Organic', 'Regenerative', 'Biodynamic'].map(cert => (
              <label
                key={cert}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.certifications.includes(cert)}
                  onChange={() => handleCertificationChange(cert)}
                  className="rounded border-gray-300"
                />
                <span>{cert}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Search Radius</h3>
          <select
            value={filters.radius}
            onChange={(e) => onFiltersChange({ ...filters, radius: Number(e.target.value) })}
            className="w-full p-2 border rounded-md"
          >
            <option value={10}>10 miles</option>
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
          </select>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchFilters;