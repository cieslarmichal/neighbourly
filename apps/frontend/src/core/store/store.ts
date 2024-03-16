import { configureStore } from '@reduxjs/toolkit';

import { preferencesStateSlice } from './states/preferencesState/preferencesStateSlice';
import { userStateSlice } from './states/userState/userStateSlice';

export const store = configureStore({
  reducer: {
    preferences: preferencesStateSlice.reducer,
    user: userStateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
