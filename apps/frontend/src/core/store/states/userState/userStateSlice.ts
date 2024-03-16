import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { User, UserState } from './userState';

const initialState: UserState = {
  currentUser: null,
  refreshToken: null,
  accessToken: null,
};

interface SetCurrentUserActionPayload {
  user: User;
}

interface SetCurrentUserTokensPayload {
  accessToken: string;
  refreshToken: string;
}

export const userStateSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<SetCurrentUserActionPayload>) => {
      state.currentUser = action.payload.user;
    },
    setCurrentUserTokens: (state, action: PayloadAction<SetCurrentUserTokensPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setCurrentUserAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    removeUserState: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.currentUser = null;
    }
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectRefreshToken: (state) => state.refreshToken,
    selectCurrentUserId: (state) => state.currentUser?.id,
    selectUserState: (state) => state,
  }
});

export const userStateActions = userStateSlice.actions;

export const userStateSelectors = userStateSlice.selectors;
