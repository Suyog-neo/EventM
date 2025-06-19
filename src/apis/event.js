import {axiosInstance as axios} from '../apis/axiosInstance';

export const adminCreateEvent = (data) => axios.post('/api/event/create-event/', data);
export const userAllEvents= (data) => axios.get('/api/event/user/get-events/', data);

