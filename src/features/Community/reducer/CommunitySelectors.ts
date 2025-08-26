// CommunitySelectors.ts
import { RootState } from "~/store";

export const selectStudentCommunity = (state: RootState) =>
  state.community.data;   // ✅ changed

export const selectLoading = (state: RootState) =>
  state.community.loading; // ✅ changed
