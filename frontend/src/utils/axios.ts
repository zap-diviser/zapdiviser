import axios from 'axios';

// @ts-ignore
const axiosServices = axios.create({ baseURL: `${window.location.origin}/api` });

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
