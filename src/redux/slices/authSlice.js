import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  role: null, 
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user ,refresh,access} = action.payload;
      state.isAuthenticated = true;
      state.role = user.role;
      state.user = user;
      state.refresh = refresh;
      state.access = access;

    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;