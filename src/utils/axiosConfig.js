import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://beta.techskims.tech/api',
  headers: {
    'Accept': 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Remove verify-code and email/resend from public endpoints
    const publicEndpoints = ['/register', '/login'];
    
    if (!publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance; 