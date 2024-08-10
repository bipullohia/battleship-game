import { configureStore } from "@reduxjs/toolkit";
import shipInfoReducer from '../store/slices/shipInfoSlice';

export const store = configureStore({
    reducer: {
        shipInfo: shipInfoReducer
    }
});