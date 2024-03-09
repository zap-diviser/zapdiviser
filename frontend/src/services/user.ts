import axiosServices from 'utils/axios';

export const userService = {
  login: async (body: { email: string; password: string }) => {
    const response = await axiosServices.post('auth/login', body);
    return response.data;
  },
  register: async (body: { email: string; password: string; name: string; phone: string }) => {
    const response = await axiosServices.post('auth/register', body);
    return response.data;
  },
  update: async (body: { has_downloaded?: boolean }) => {
    const response = await axiosServices.patch('user', body);
    return response.data;
  },
  forgetPassword: async (body: { email: string; code: string; newPassword: string }) => {
    const response = await axiosServices.post('user/forget-password', body);
    return response.data;
  },
  checkCodeIsValid: async (body: { email: string; code: string }) => {
    const response = await axiosServices.post('user/forget-password/check-code', body);
    return response.data;
  }
};
