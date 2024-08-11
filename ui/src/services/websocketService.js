import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_CONFIG } from "../utils/constants";
import { setConnected } from "../store/slices/websocketSlice";

const createWebsocketService = (dispatch) => {
    let client = null;
    let connectionPromise = null;

    const connect = () => {
        if (client && client.connected) {
            return Promise.resolve();
        }

        if (connectionPromise) {
            return connectionPromise;
        }

        connectionPromise = new Promise((resolve, reject) => {
            client = new Client({
                webSocketFactory: () => new SockJS(WS_CONFIG.URL),
                onConnect: () => {
                    dispatch(setConnected(true));
                    resolve();
                },
                onDisconnect: () => {
                    dispatch(setConnected(false));
                },
                onStompError: (frame) => {
                    console.error('websocketService: Error reported by the broker: ' + frame.headers[`message`]);
                    console.error('websocketService: More Error info: ' + frame.body);
                    reject(new Error('websocketService: Websocket connection error!'))
                }
            });

            client.activate();
        });

        return connectionPromise;
    }

    const disconnect = () => {
        if (client) {
            client.deactivate();
            client = null;
            connectionPromise = null;
        }
    }

    const subscribe = (destination, callback) => {
        if (client && client.connected) {
            return client.subscribe(destination, (message) => {
                const payload = JSON.parse(message.body);
                callback(payload);
            });
        } else {
            console.error('Websocket not connected, cannot subscribe successfully');
            return null;
        }
    }

    const sendMessage = (destination, message) => {
        if (client && client.connected) {
            client.publish({
                destination,
                body: JSON.stringify(message)
            });
        } else {
            console.error('Websocket not connected, cannot send message');
            return null;
        }
    }

    return { connect, disconnect, subscribe, sendMessage };
}

export default createWebsocketService;