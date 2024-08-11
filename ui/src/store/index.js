import { configureStore } from "@reduxjs/toolkit";
import shipInfoReducer from '../store/slices/shipInfoSlice';
import websocketReducer from '../store/slices/websocketSlice';
import createWebsocketService from "../services/websocketService";

const store = configureStore({
    reducer: {
        shipInfo: shipInfoReducer,
        websocket: websocketReducer
    }
});

const websocketService = createWebsocketService(store.dispatch);

export {  store, websocketService };