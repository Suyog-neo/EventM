import { axiosInstance as axios } from '../apis/axiosInstance';

export const seatBook = (data) => axios.post('/api/book-seat/', data);
export const getSeatBookData = () => axios.get('/api/booking-history/');
export const getSeatsAvailable = (id) => axios.get(`/api/check-seat-availability/${id}/`)