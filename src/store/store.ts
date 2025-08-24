import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import Ticket from '../features/Ticket/reducers/ModuleSlice';
import CourseSlice from '../features/Courses/Reducers/courseSlice';
import AuthSlice from '../features/Authentication/reducers/authSlice';
import ProfileSlice from '../features/Profile/reducer/profileSlice';
import DashboardSlice from '../features/home/reducer/DashboardSlice';

const store = configureStore({
  reducer: {
    tabReducer: tabReducer,
    Ticket: Ticket,
    CourseSlice: CourseSlice,
    AuthSlice: AuthSlice,
    ProfileSlice: ProfileSlice,
    DashboardSlice: DashboardSlice,
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
