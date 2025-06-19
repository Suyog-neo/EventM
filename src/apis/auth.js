import {axiosInstance as axios} from '../apis/axiosInstance';

export const loginUser = (data) => axios.post('/auth/login/', data);
export const register= (data) => axios.post('/auth/register/', data);
export const OtpVerify= (data) => axios.post('/auth/verify/', data);

