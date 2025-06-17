import { axiosInstance as axios } from '../apis/axiosInstance';

export const addEvent = (data) => axios.post('/event', data);
export const getEvent = ()=> axios.get('/')