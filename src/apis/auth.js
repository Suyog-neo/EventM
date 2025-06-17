import {axiosInstance as axios} from '../apis/axiosInstance';

export const loginUser = (data) => axios.post('/auth/login', data);
export const signup= (data) => axios.post('/auth/register/', data);
export const logout = () => axios.post('/auth/logout');
