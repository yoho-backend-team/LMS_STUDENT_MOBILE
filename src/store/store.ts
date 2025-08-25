import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import tabReducer from './tab/tabSlice';
import Ticket from "../features/Ticket/reducers/ModuleSlice"
// import faqslice from "../features/faq/reducer/faqslice";
import faqreducer from "../features/faq/reducer/faqslice"
const store = configureStore({
	reducer: {
		tabReducer: tabReducer,
		Ticket:Ticket,
		// faq: faqslice,
		faq: faqreducer,

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
