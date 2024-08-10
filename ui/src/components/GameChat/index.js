import { useState, useRef } from 'react'
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import './GameChat.css'
import ChatBox from './ChatBox'
import { WS_CONFIG } from '../../utils/constants'

const GameChat = () => {
    const [username, setUsername] = useState('');
    const [joinedChat, setJoinedChat] = useState(false);
    const [rejoinedChat, setRejoinedChat] = useState(false); //once you rejoin - you can never technically 'join' as a new user again
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);

    const chatMessageRef = useRef(null);
    const chatUsernameRef = useRef(null);


    const joinChatRoom = () => {
        setJoinedChat(true);
        setRejoinedChat(false);
        createWebsocketConnection();
    }

    const createWebsocketConnection = () => {
        const socket = new SockJS(WS_CONFIG.URL);
        const newClient = Stomp.over(socket);

        //depending on public or private chat - this can differ - we can send to different topics
        newClient.connect({}, (frame) => {
            console.log("Connected to websocket: " + frame);

            //subscribes to a topic to listen to the incoming messages
            newClient.subscribe(WS_CONFIG.READ_PATH_CHAT, (message) => {
                //working with the message received
                const receivedMsg = JSON.parse(message.body);
                setMessages((prevMsgs) => [...prevMsgs, receivedMsg]);
            });

            //sending a new message to /hello
            newClient.send(WS_CONFIG.WRITE_PATH_CHAT, {}, JSON.stringify({
                'sender': username,
                'type': 'JOIN'
            }));

            chatMessageRef.current.focus();
        }, (error) => {
            console.log('Failed to connect to the WebSocket', error);
        });

        setClient(newClient);
    }

    const leaveChatRoom = () => {
        setJoinedChat(false);
        setRejoinedChat(true);
        removeWebSocketConnection();
    }

    const removeWebSocketConnection = () => {
        if (client) {
            //sending a msg before leaving the chat
            client.send(WS_CONFIG.WRITE_PATH_CHAT, {}, JSON.stringify({
                'sender': username,
                'type': 'LEAVE'
            }));
            client.deactivate();
            setClient(null);
            console.log('Websocket connection deactivated...');

            //resetting the username field
            // setUsername('');
            // chatUsernameRef.current.value = '';
            // chatUsernameRef.current.focus(); //doesn't work yet
        }
    }

    const handleEnterForUsernameSubmit = (e) => {
        if (e.key === 'Enter') {
            joinChatRoom();
        }
    }

    const chatProps = {
        client: client,
        username: username,
        chatMessageRef: chatMessageRef,
        joinedChat, joinedChat,
        messages: messages
    }


    return (
        <div>
            <h5 className="fw-bolder mt-3">Game Chatroom!</h5>

            <div className={joinedChat ? 'd-none' : (rejoinedChat ? 'd-none' : 'joinChatWindow')}>
                <p className='mb-2 fw-light fs-6'>You can view the live chat once you join the public chatroom</p>
                <div className="input-group mb-2 mt-2 w-50 mx-auto">
                    <span className="input-group-text">@</span>
                    <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="input-chat-username"
                        value={username} ref={chatUsernameRef} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleEnterForUsernameSubmit}>
                    </input>
                </div>
                <button type="button" className="btn btn-success" id="button-joinchatroom" onClick={joinChatRoom} disabled={!username.trim()}>Join chatroom</button>
            </div>
            <br />
            {/* if there are messages to show (joining a room adds a message), then show the chatbox */}
            <ChatBox chatProps={chatProps} />
            <div>
                <button type="button" className={rejoinedChat ? 'btn btn-success me-2' : 'd-none'} onClick={joinChatRoom}>Rejoin<span className='reload ms-2'>&#x21bb;</span></button>
                <button type="button" className={joinedChat ? 'btn btn-danger' : 'd-none'} onClick={leaveChatRoom}>Leave</button>
            </div>
        </div>
    )
}


export default GameChat;

//TODO: when a new user connects to the server with the username - we need to tell it all the others who have already connected to the chat server.
