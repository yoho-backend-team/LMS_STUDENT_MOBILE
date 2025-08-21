export const SET_SELECTED_TAB = 'SET_SELECTED_TAB' as const;

export interface SetSelectedTabAction {
	type: typeof SET_SELECTED_TAB;
	payload: {
		selectedTab: string;
	};
}

export type TabActionTypes = SetSelectedTabAction;
