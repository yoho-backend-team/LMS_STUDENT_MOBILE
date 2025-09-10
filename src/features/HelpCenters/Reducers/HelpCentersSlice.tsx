import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type HelpItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  videolink?: string;
};

interface HelpCenterState {
  helpcenterData: HelpItem[] | null;
}

const initialState: HelpCenterState = {
  helpcenterData: null,
};

const helpSlice = createSlice({
  name: 'helpcenterSlice',
  initialState,
  reducers: {
    fetchHelpCenterData: (state, action: PayloadAction<HelpItem[]>) => {
      state.helpcenterData = action.payload;
    },
  },
});

export const { fetchHelpCenterData } = helpSlice.actions;
export default helpSlice.reducer;
