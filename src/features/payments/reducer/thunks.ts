import { getPayment } from "../service";
import { getPaymentData } from "./paymentSlice";

export const getPaymentthunks = (params: any) => async (dispatch: any) => {
    try {
        const response = await getPayment(params);
        dispatch(getPaymentData(response?.data?.data));
    } catch (error) {
        console.log(error);
    }
};