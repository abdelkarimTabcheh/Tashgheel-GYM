import axios from 'axios';

let onUnauthorized = () => {};

// This will be called from main.jsx
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default API;

export const fetchHomeConfig = async () => {
  try {
    console.log('Fetching home config from:', '/admin/home-config');
    const response = await API.get('/admin/home-config');
    console.log('Home config response:', response.data);
    return response;
  } catch (error) {
    console.error('Failed to fetch home config:', error.response?.status, error.response?.data);
    throw error;
  }
};

export const updateHomeConfig = async (config) => {
  try {
    console.log('Updating home config:', config);
    const response = await API.put('/admin/home-config', config);
    console.log('Update home config response:', response.data);
    return response;
  } catch (error) {
    console.error('Failed to update home config:', error.response?.status, error.response?.data);
    throw error;
  }
};
