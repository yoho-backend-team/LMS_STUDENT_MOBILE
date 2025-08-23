import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import ActivitySlice from '../features/reducer/activitylog/reducers/ActivitySlice'

const store = configureStore({
	reducer: {
		tabReducer: tabReducer,
		ActivitySlice : ActivitySlice,
	},
});

export { store };

// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
