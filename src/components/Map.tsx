'use client';

interface MapProps {
  center: [number, number];
}

const Map = ({ center }: MapProps): JSX.Element => {
  const [lat, lng] = center;

  return (
    <div className="h-full w-full relative rounded-lg overflow-hidden bg-gray-100">
      {/* Placeholder map image */}
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500 flex flex-col items-center">
          <svg 
            className="w-12 h-12 mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="text-sm">
            Map View ({lat.toFixed(4)}, {lng.toFixed(4)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Map; 