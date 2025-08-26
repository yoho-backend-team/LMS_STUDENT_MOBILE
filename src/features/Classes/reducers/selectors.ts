import { RootState } from '../../../store/store';

export const GetClassesSelector = (state: RootState) => state.Classes?.data || [];

