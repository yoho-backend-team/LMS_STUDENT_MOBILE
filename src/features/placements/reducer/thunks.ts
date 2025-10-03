import { getPlacement } from "../service";
import { getPlacementData } from "./placementSlice";

export const getPlacementthunks = (params: any) => async (dispatch: any) => {
    try {
        const response = await getPlacement(params);
        dispatch(getPlacementData(response?.data?.data));
    } catch (error) {
        console.log(error);
    }
};