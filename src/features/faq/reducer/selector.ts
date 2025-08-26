// import { RootState } from '~/store/store';

// export const selectFaqData = (state: RootState) => state.faqSlice.faqData;

import { RootState } from "~/store/store";

export const selectFaqData = (state: RootState) => state.faqSlice.faqData;
export const selectFaqLoading = (state: RootState) => state.faqSlice.loading;
export const selectFaqError = (state: RootState) => state.faqSlice.error;

