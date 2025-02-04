import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
});

// Locations API
export const searchLocations = async (lat, lng, radius, type) => {
  const params = { lat, lng, radius };
  if (type) params.type = type;
  const response = await api.get('/locations/search', { params });
  return response.data;
};

export const getLocation = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

// User API
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const addToFavorites = async (locationId) => {
  const response = await api.post(`/users/favorites/${locationId}`);
  return response.data;
};

export const removeFromFavorites = async (locationId) => {
  const response = await api.delete(`/users/favorites/${locationId}`);
  return response.data;
};

export const saveSearch = async (searchParams) => {
  const response = await api.post('/users/searches', searchParams);
  return response.data;
};