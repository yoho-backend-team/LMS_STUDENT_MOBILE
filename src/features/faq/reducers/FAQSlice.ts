import { createSlice } from "@reduxjs/toolkit";

const faqSlice = createSlice({
  name: "faqSlice", 
  initialState: {
    data: [] as any[],
  },
  reducers: {
    getfaq: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getfaq } = faqSlice.actions;
export default faqSlice.reducer;
