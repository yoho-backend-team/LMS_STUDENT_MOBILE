import { createSlice } from '@reduxjs/toolkit';

const PaymentSlice = createSlice({
    name: 'PaymentSlice',
    initialState: {
        data: [],
       
    },
    reducers: {
        getPaymentData: (state, action) => {
            state.data = action.payload;
        },

    },
});

export const { getPaymentData } = PaymentSlice.actions;
export default PaymentSlice.reducer;