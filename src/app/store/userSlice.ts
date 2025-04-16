// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  role: 'admin' | 'student' | null;
  name?: string;
}

const initialState: UserState = {
  id: null,
  role: null,
  name: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.name = action.payload.name;
    },
    clearUser(state) {
      state.id = null;
      state.role = null;
      state.name = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
