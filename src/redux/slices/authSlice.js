import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  role: null, // 'user' or 'admin'
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { role, user ,username} = action.payload;
      state.isAuthenticated = true;
      state.userName = username;
      state.role = role;
      state.user = user;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
