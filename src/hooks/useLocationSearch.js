import { useState, useEffect } from 'react';
import { getCoordinatesFromZip, calculateDistance } from '../utils/geocoding';

const useLocationSearch = (zipCode, radius = 50) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    const searchLocations = async () => {
      if (!zipCode) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get coordinates for the zip code
        const coords = await getCoordinatesFromZip(zipCode);
        setCenter([coords.lat, coords.lng]);

        // TODO: Replace with actual API call to your backend
        // This is where you'll fetch locations from your database
        // based on the coordinates and radius
        const mockApiCall = async () => {
          // Simulated delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return [
            {
              id: 1,
              name: 'Sample Farm',
              type: 'farm',
              lat: coords.lat + 0.1,
              lng: coords.lng + 0.1,
              address: '123 Farm Rd',
              certifications: ['Organic']
            },
            // Add more mock data as needed
          ];
        };

        const fetchedLocations = await mockApiCall();
        
        // Filter locations by radius
        const filteredLocations = fetchedLocations.filter(location => {
          const distance = calculateDistance(
            coords.lat,
            coords.lng,
            location.lat,
            location.lng
          );
          return distance <= radius;
        });

        setLocations(filteredLocations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    searchLocations();
  }, [zipCode, radius]);

  return { locations, loading, error, center };
};

export default useLocationSearch;