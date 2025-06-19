import {axiosInstance as axios} from '../apis/axiosInstance';

//admin
export const adminCreateEvent = (data) => axios.post('/api/event/create-event/', data); //admin - create event screen
export const adminAllEvents= (data) => axios.get('/api/event/get-events/', data); //admin- manage events screen
export const adminEditEvents = (id, data) => axios.patch(`/api/event/update-event/${id}/`, data); //admin- manage events screen/Edit Events


//user
export const userAllEvents= (data) => axios.get('/api/event/user/get-events/', data); //user -  view all events screen
export const userOffers= (data) => axios.get('/api/event/user/get-event-offers/', data); //user- offers screen
export const userUpcoming= (data) => axios.get('/api/event/user/get-events/', data); //user- upcoming screens

