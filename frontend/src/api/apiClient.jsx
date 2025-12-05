import axios from 'axios';

// Create an Axios instance for all API calls
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token from localStorage to Authorization header if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
