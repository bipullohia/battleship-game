import { configureStore } from "@reduxjs/toolkit";
import shipInfoReducer from '../store/slices/shipInfoSlice';
import websocketReducer from '../store/slices/websocketSlice';
import gameInfoReducer from '../store/slices/gameInfoSlice';
import createWebsocketService from "../services/websocketService";

const store = configureStore({
    reducer: {
        shipInfo: shipInfoReducer,
        websocket: websocketReducer,
        gameInfo: gameInfoReducer
    }
});

const websocketService = createWebsocketService(store.dispatch);

export {  store, websocketService };