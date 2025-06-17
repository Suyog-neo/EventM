import { createSlice } from '@reduxjs/toolkit';

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: [],
  reducers: {
    bookEvent(state, action) {
      const event = action.payload;
      const alreadyBooked = state.find((b) => b.id === event.id);
      if (!alreadyBooked) {
        state.push(event);
      }
    },
  },
});

export const { bookEvent } = bookingsSlice.actions;
export default bookingsSlice.reducer;
