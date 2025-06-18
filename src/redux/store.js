import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventsReducer from './slices/eventsSlice';
import bookingsReducer from './slices/bookingsSlice';


// load the auth data of user from localstorage 
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('auth');
    if (serializedState === null) return undefined;
    return { auth: JSON.parse(serializedState) };
  } catch (error) {
    console.log(error.message)
    return undefined;
  }
}



export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    bookings: bookingsReducer,
  },
  preloadedState: loadState()
});


// check user is login and save tokens 
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.isAuthenticated) {
    localStorage.setItem('auth', JSON.stringify(state.auth));
  } else {
    localStorage.removeItem('auth');
  }
});