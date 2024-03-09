import axios from 'axios';

const axiosServices = axios.create({ baseURL: '/api' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data.error) || 'Wrong Services');
  }
);

export default axiosServices;
