import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
	name: 'AuthSlice',
	initialState: {
		data: [],
		user: [],
	},
	reducers: {
		token: (state, action) => {
			state.data = action.payload;
		},
		user: (state, action) => {
			state.user = action.payload;
		}
	},
});

export const { token, user } = AuthSlice.actions;
export default AuthSlice.reducer;
