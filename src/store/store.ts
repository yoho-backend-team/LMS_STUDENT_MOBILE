import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import ProfileSlice from '../features/Profile/reducer/profileSlice';


const store = configureStore({
	reducer: {
		tabReducer: tabReducer,
		ProfileSlice: ProfileSlice,
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
