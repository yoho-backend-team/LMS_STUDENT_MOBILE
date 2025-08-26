import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import Ticket from '../features/Ticket/reducers/ModuleSlice';
import CourseSlice from '../features/Courses/Reducers/courseSlice';
import AuthSlice from '../features/Authentication/reducers/authSlice';
import ProfileSlice from '../features/Profile/reducer/profileSlice';
import DashboardSlice from '../features/home/reducer/DashboardSlice';
import helpReducer from '../features/HelpCenter/Reducer/HelpSlice';
import NotificationSlice from '../features/notification/reducers/notificationSlice';
import ActivitySlice from "../features/reducer/activitylog/reducers/ActivitySlice"
import PaymentSlice from '../features/payments/reducer/paymentSlice'
import faqReducer from "../features/faq/reducer/faqSlice"; 
import ClassSlice from '../features/classes/reducers/classslice'
import ClassIdSlice from '../features/classid/reducers/classidslice'

const store = configureStore({
  reducer: {
    tabReducer: tabReducer,
    Ticket: Ticket,
    CourseSlice: CourseSlice,
    AuthSlice: AuthSlice,
    ProfileSlice: ProfileSlice,
    DashboardSlice: DashboardSlice,
    helpSlice: helpReducer,
    NotificationSlice: NotificationSlice,
		ActivitySlice: ActivitySlice,
    PaymentSlice:PaymentSlice,
    faq:faqReducer ,
    ClassSlice: ClassSlice,
    ClassIdSlice: ClassIdSlice,
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
