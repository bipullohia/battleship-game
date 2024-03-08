import { useState, useRef } from 'react';
import { Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client';
import './GameChat.css';

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
                //working with the message received
                const receivedMsg = JSON.parse(message.body);
                setMessages((prevMsgs) => [...prevMsgs, receivedMsg]);
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
            //sending a msg before leaving the chat
            client.send("/app/battleship/chat", {}, JSON.stringify({
                'sender': username,
                'type': 'LEAVE'
            }));
            client.deactivate();
            setClient(null);
            console.log('Websocket connection deactivated...');

            //resetting the username field
            setUsername('');
            chatUsernameRef.current.value = '';
            chatUsernameRef.current.focus(); //doesn't work yet
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

    //assign colors to each participant?? - we need to keep a list of all the participants in that case
     //If left the chat, remove the option to show new texts and remove the ability to send new texts, but keep the old texts on. If rejoining the chat, start the chat afresh
    //make the topic name and url name better and more aligned
    //make chatscreen 1/3 on the right vertically and scrollable

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
                <div className="card mb-2 p-2">
                    <div className="card-body">
                        {messages.map((receivedMsg, index) => {
                            if(receivedMsg.type === 'CHAT'){
                                //if the user is sending the msg, that should display to the right. If the message is from someone else it's rendered on the left
                                if(receivedMsg.sender === username){
                                    return <p className="fst-normal chat-text text-end mb-1" key={index}>
                                    <span className='text-secondary'>{receivedMsg.sender}: </span>{receivedMsg.content}</p>
                                }else{
                                    return <p className="fst-normal chat-text text-start mb-1" key={index}>
                                    <span className='text-secondary'>{receivedMsg.sender}:  </span>{receivedMsg.content}</p>
                                }
                                
                            }else if(receivedMsg.type === 'JOIN'){
                                return <p className="fst-italic fw-lighter text-muted text-center chat-notification mb-2 mt-1" key={index}>
                                    @{receivedMsg.sender} has joined the chat!</p>
                            }else if(receivedMsg.type === 'LEAVE'){
                                return <p className="fst-italic fw-lighter text-muted text-center chat-notification mb-2 mt-1" key={index}>
                                    @{receivedMsg.sender} has left the chat!</p>
                            }else{
                                console.log(`Wrong msg type: ${receivedMsg.type}. Ignoring this!`)
                                return <div/>
                            }
                        })}
                    </div>
                    <div className="input-group p-2">
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