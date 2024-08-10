import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_SHIP_INFO } from "../../utils/constants";

export const shipInfoSlice = createSlice({
    name: 'shipInfo',
    initialState: DEFAULT_SHIP_INFO,
    reducers: {
        updateShipInfo: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetShipInfo: () => {
            return DEFAULT_SHIP_INFO;
        }
    }
});

export const { updateShipInfo, resetShipInfo } = shipInfoSlice.actions;
export default shipInfoSlice.reducer;