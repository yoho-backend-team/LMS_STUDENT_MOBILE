import { RootState } from '~/store/store';

export const selectHelpCenterData = (state: RootState) => state.helpSlice.helpcenterData;
