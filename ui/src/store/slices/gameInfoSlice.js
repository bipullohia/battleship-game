import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    gameId: null
}

export const gameInfoSlice = createSlice({
    name: 'gameInfo',
    initialState,
    reducers: {
        updateGameInfo: (state, action) => {
            return { ...state, ...action.payload };
        },
        resetGameInfo: () => {
            return initialState;
        }
    }
});

export const { updateGameInfo, resetGameInfo } = gameInfoSlice.actions;
export default gameInfoSlice.reducer; 