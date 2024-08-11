import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    connected: false,
    messages: []
};

//this slice manages the connection status, and keeps tracks of messages
export const websocketSlice = createSlice({
    name: 'websocket',
    initialState, //since property name matches the variable, we don't need to write initialState: initialState here
    reducers: {
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        deleteAllMessages: (state) => {
            state.messages = [];
        }
    }
});

export const { setConnected, addMessage, deleteAllMessages } = websocketSlice.actions;
export default websocketSlice.reducer;

