import { getLiveClassDetails } from '../services';
import { getclassdetails } from './classslice';

export const getClassDetails =
    (params: any) => async (dispatch: any) => {
        try {
            const response = await getLiveClassDetails(params);
            console.log(response, 'login response');
            dispatch(getclassdetails(response));
        } catch (error) {
            console.log(error);
        }
    };
