// import { RootState } from '~/store/store';

// export const selectFaqData = (state: RootState) => state.faqSlice.faqData;

// import { RootState } from "~/store/store";

// export const selectFaqData = (state: RootState) => state.faqSlice.faqData;
// export const selectFaqLoading = (state: RootState) => state.faqSlice.loading;
// export const selectFaqError = (state: RootState) => state.faqSlice.error;


import { RootState } from "~/store/store";

export const selectFaqData    = (s: RootState) => s.faq.faqData;
export const selectFaqLoading = (s: RootState) => s.faq.loading;
export const selectFaqError   = (s: RootState) => s.faq.error;



