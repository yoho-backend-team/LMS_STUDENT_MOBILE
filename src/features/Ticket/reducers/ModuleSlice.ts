import { createSlice } from '@reduxjs/toolkit';

const ModuleSlice = createSlice({
	name: 'Ticket',
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

	
} = ModuleSlice.actions;
export default ModuleSlice.reducer;
