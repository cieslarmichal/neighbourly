import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { PreferencesState, UiMode } from './preferencesState';

const initialState: PreferencesState = {
  uiMode: 'light' as UiMode,
};

interface SetUiModeActionPayload {
  uiMode: UiMode;
}

export const preferencesStateSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setUiMode: (state, action: PayloadAction<SetUiModeActionPayload>) => {
      state.uiMode = action.payload.uiMode;
    },
  },
});

export const preferencesStateActions = preferencesStateSlice.actions;
