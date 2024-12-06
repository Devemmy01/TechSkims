import axios from 'axios';
import { toast } from 'react-toastify';

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      // Don't check for token on login request
      if (config.url.includes('/login')) {
        return config;
      }

      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      
      if (!token || !userRole) {
        return Promise.reject(new Error('No authentication token'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !error.config.url.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}; 