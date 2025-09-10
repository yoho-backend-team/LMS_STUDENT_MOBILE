import { createSlice } from '@reduxjs/toolkit';

const TicketSlice = createSlice({
	name: 'Tickets',
	initialState: {
		ticket: [],
		
	},
	reducers: {
		getTicket: (state, action) => {
			state.ticket = action.payload;
		},
        CreatTicketmodule: (state, action) => {
			state.ticket = action.payload;
		},

	
	},
});
export const {
	getTicket,
    CreatTicketmodule	
} 

= TicketSlice.actions;
export default TicketSlice.reducer;
