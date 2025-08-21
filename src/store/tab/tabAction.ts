// actions.ts

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { SET_SELECTED_TAB, SetSelectedTabAction } from '../../types/types';

export const setSelectedTabSuccess = (
	selectedTab: string
): SetSelectedTabAction => ({
	type: SET_SELECTED_TAB,
	payload: { selectedTab },
});

// Thunk action
export const setSelectedTab = (
	selectedTab: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
	return (dispatch) => {
		dispatch(setSelectedTabSuccess(selectedTab));
	};
};
