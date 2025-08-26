
// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import { services } from "../services/index";

// export type FaqItem = {
//   id?: string | number;
//   question: string;
//   answer: string;
// };

// type FaqState = {
//   items: FaqItem[];
//   loading: boolean;
//   error: string | null;
// };

// const initialState: FaqState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// export const fetchFaqs = createAsyncThunk<FaqItem[], void, { rejectValue: string }>(
//   "faq/fetchFaqs",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await services.faq.get();
//       if (!Array.isArray(data)) return rejectWithValue("Invalid FAQ response");
//       return data as FaqItem[];
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || err?.message || "Failed to fetch FAQs";
//       return rejectWithValue(msg);
//     }
//   }
// );

// const faqSlice = createSlice({
//   name: "faq",
//   initialState,
//   reducers: {
//     clearFaqError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFaqs.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchFaqs.fulfilled, (state, action: PayloadAction<FaqItem[]>) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchFaqs.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Something went wrong";
//       });
//   },
// });

// export const { clearFaqError } = faqSlice.actions;
// export default faqSlice.reducer;

// // Selectors
// export const selectFaqItems   = (state: any) => state.faq.items;
// export const selectFaqLoading = (state: any) => state.faq.loading;
// export const selectFaqError   = (state: any) => state.faq.error;

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// export type FaqItem = {
//   id: number;
//   category: string;
//   question: string;
//   answer: string;
//   videolink?: string;
// };

// interface FaqState {
//   faqData: FaqItem[] | null;
// }

// const initialState: FaqState = {
//   faqData: null,
// };

// const FaqSlice = createSlice({
//   name: 'faqSlice',
//   initialState,
//   reducers: {
//     fetchFaqData: (state, action: PayloadAction<FaqItem[]>) => {
//       state.faqData = action.payload;
//     },
//   },
// });

// export const { fetchFaqData } = FaqSlice.actions;
// export default FaqSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
  videolink?: string;
};

interface FaqState {
  faqData: FaqItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: FaqState = {
  faqData: null,
  loading: false,
  error: null,
};

const FaqSlice = createSlice({
  name: "faqSlice",
  initialState,
  reducers: {
    fetchFaqStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFaqData: (state, action: PayloadAction<FaqItem[]>) => {
      state.faqData = action.payload;
      state.loading = false;
    },
    fetchFaqError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchFaqStart, fetchFaqData, fetchFaqError } = FaqSlice.actions;
export default FaqSlice.reducer;
export type { FaqState };

