import { axiosInstance as axios } from '../apis/axiosInstance';

export const loginUser = (data) => axios.post('/auth/login/', data);
export const register = (data) => axios.post('/auth/register/', data);
export const OtpVerify = (data) => axios.post('/auth/verify/', data);
export const forgotPassword = (data) => axios.post('/auth/auth/forgot-password/', data);
export const resetPassword = (data) => axios.post('/auth/auth/reset-password/', data)
export const logout = () => axios.post('/auth/logout');

