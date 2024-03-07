import { useState, useRef } from 'react';
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client';

function GameChat() {
    const [username, setUsername] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [joinedChat, setJoinedChat] = useState(false);
    const [client, setClient] = useState(null);
    const [messages, setMessages] = useState([]);

    const chatMessageRef = useRef(null);
    const chatUsernameRef = useRef(null);


    const joinChatRoom = () => {
        setJoinedChat(true);
        createWebsocketConnection();
    }

    const createWebsocketConnection = () => {
        const socket = new SockJS('http://localhost:8080/chat');
        const newClient = Stomp.over(socket);

        newClient.debug = (msg) => console.log("createWebsocketConnection: " + msg);

        newClient.connect({}, () => {
            console.log("Connected to websocket...");
            newClient.subscribe('/topic/public', (message) => {
                console.log('Received Message: ' + message.body);

                //working with the message received
                const receivedMsg = JSON.parse(message.body);
                var msg = "";
                //if someone joined
                if (receivedMsg.type === 'JOIN') {
                    msg = `@${receivedMsg.sender} joined the chat!`;
                }
                //if a message is sent
                else if (receivedMsg.type === 'CHAT') {
                    msg = `@${receivedMsg.sender}: ${receivedMsg.content}`;
                }

                //if someone left
                //.... to be done later ....    

                console.log(msg);
                setMessages((prevMsgs) => [...prevMsgs, msg]);
            });

            newClient.send("/app/battleship/chat", {}, JSON.stringify({
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
        removeWebSocketConnection();
    }

    const removeWebSocketConnection = () => {
        if (client) {
            //we can do something for users leaving the chat
            // client.send("/app/battleship/chat", {}, JSON.stringify({
            //     'sender': username,
            //     'type': 'LEAVE'
            // }));
            client.deactivate();
            setClient(null);
            console.log('Websocket connection deactivated...');
            setUsername('');
            chatUsernameRef.current.value = '';
            chatUsernameRef.current.focus();
        }
    }

    const sendChatMessage = () => {
        if(client){
            client.send("/app/battleship/chat", {}, JSON.stringify({
                'sender': username,
                'type': 'CHAT',
                'content': chatMessage
            }));
            setChatMessage('');
            chatMessageRef.current.value = '';
            chatMessageRef.current.focus();
            //TODO: turn focus back on the input field
        }
    }

    const handleEnterForUsernameSubmit = (e) => {
        if(e.key === 'Enter'){
            joinChatRoom();
        }
    }

    const handleEnterForMessageSent = (e) => {
        if(e.key === 'Enter'){
            sendChatMessage();
        }
    }

    return (
        <div>
            <h5 className="fw-bolder mb-2">Game Chat!</h5>

            <div className={joinedChat ? 'd-none' : 'joinChatWindow'}>
                <p className='mb-2 fw-light fs-6'>You can view the live chat once you join the public chatroom</p>
                <div className="input-group mb-2 mt-3 w-50 mx-auto">
                    <span className="input-group-text">@</span>
                    <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="input-chat-username"
                        value={username} ref={chatUsernameRef} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleEnterForUsernameSubmit}>
                    </input>
                </div>
                <button type="button" className="btn btn-success" id="button-joinchatroom" onClick={joinChatRoom} disabled={!username.trim()}>Join chatroom</button>
            </div>

            <br />

            <div className={joinedChat ? 'chatWindow' : 'd-none'}>
                <div className="card mb-2">
                    <div>Your chat will be visible here...</div>
                    <div className="card-body">
                        {messages.map((msg, index) => {
                            return <div key={index}>{msg}</div>
                        })}
                    </div>
                    <div className="input-group p-2 w-75 mx-auto">
                        <input type="text" className="form-control" placeholder="Type your message..." aria-label="Type your message..." aria-describedby="input-chat-message"
                            defaultValue={chatMessage} ref={chatMessageRef} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={handleEnterForMessageSent}>
                        </input>
                    <button className="btn btn-success" type="button" id="button-chat-send" onClick={sendChatMessage} disabled={!chatMessage.trim()}>Send</button>
                </div>
                </div>
                
                <button type="button" className="btn btn-danger" onClick={leaveChatRoom}>Leave</button>
            </div>

        </div>
    )
}


export default GameChat;