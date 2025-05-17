import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  email: string;
  phone: string;
  token: string;
  id: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  username: '',
  email: '',
  phone: '',
  token: '',
  id: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ username: string; email: string; phone: string; token: string; id: string; }>
    ) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = '';
      state.email = '';
      state.phone = '';
      state.token = '';
      state.id = '';
      state.isLoggedIn = false;
    },
    updateInfo: (
      state,
      action: PayloadAction<{ username: string; email: string }>
    ) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
  },
});

export const { login, logout, updateInfo } = userSlice.actions;
export default userSlice.reducer;