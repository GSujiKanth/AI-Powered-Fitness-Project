import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState : {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null
  },
  reducers: {
    setCredentials: (state, action) => {
      //update the redux state and local storage when credentials are set
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.user.sub;

      localStorage.setItem('token', action.payload.user);
      localStorage.setItem('user', JSON.stringify(action.payload.user));  //user info is token decoded, it has to stringify
      localStorage.setItem('userId', action.payload.user.sub);
    },
    logout: (state) => {
      //credentials will be reset when user logout
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions;
//export const authReducer = authSlice.reducer;
export default authSlice.reducer; // Keep this if you want both