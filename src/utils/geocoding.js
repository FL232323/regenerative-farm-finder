// Utility for converting zip codes to coordinates
export const getCoordinatesFromZip = async (zipCode) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=USA&format=json`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    throw new Error('Zip code not found');
  } catch (error) {
    console.error('Error geocoding zip code:', error);
    throw error;
  }
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};