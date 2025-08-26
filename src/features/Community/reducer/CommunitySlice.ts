import { createSlice } from "@reduxjs/toolkit";

const CommunitySlice = createSlice({
  name: "studentCommunity",
  initialState: {
    data: [],
    loading: true,
  },
  reducers: {
    setStudentCommunity: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setStudentCommunity, setLoading } = CommunitySlice.actions;
export default CommunitySlice.reducer;
