import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import CourseSlice from '../features/Courses/Reducers/courseSlice'

import AuthSlice from '../features/Authentication/reducers/authSlice';
import ProfileSlice from '../features/Profile/reducer/profileSlice';


const store = configureStore({
	reducer: {
		tabReducer: tabReducer,
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
