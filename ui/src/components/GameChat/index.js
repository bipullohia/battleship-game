import { useState, useRef, useEffect } from 'react'
import './GameChat.css'
import ChatBox from './ChatBox'
import { WS_CONFIG } from '../../utils/constants'
import { websocketService } from '../../store'

const GameChat = () => {
    const [username, setUsername] = useState('');
    const [joinedChat, setJoinedChat] = useState(false);
    const [rejoinedChat, setRejoinedChat] = useState(false); //once you rejoin - you can never technically 'join' as a new user again
    const [messages, setMessages] = useState([]);

    const chatMessageRef = useRef(null);
    const chatUsernameRef = useRef(null);

    //for ws connection
    const [isChatActive, setIsChatActive] = useState(false);

    useEffect(() => {
        //clean up when component unmounts
        return () => {
            if (isChatActive) {
                websocketService.disconnect();
            }
        }
    }, [isChatActive]);

    const joinChatRoom = async () => {
        setJoinedChat(true);
        setRejoinedChat(false);

        try {
            await websocketService.connect();
            setIsChatActive(true);

            //subscribe to chat messages so we can receive the messages
            websocketService.subscribe(WS_CONFIG.READ_PATH_CHAT, handleNewChatMessage);

            //send the join chat message
            websocketService.sendMessage(WS_CONFIG.WRITE_PATH_CHAT, {
                'sender': username,
                'type': 'JOIN'
            });
        } catch (error) {
            console.error('Failed to start chat - websocket connection setup issue', error);
        }
    }

    const handleNewChatMessage = (message) => {
        setMessages(prevMsgs => [...prevMsgs, message]);
    }

    const leaveChatRoom = () => {
        setJoinedChat(false);
        setRejoinedChat(true);
        removeWebSocketConnection();
    }

    const removeWebSocketConnection = () => {
        //send the Leave chat message
        websocketService.sendMessage(WS_CONFIG.WRITE_PATH_CHAT, {
            'sender': username,
            'type': 'LEAVE'
        });
        websocketService.disconnect();
    }

    const handleEnterForUsernameSubmit = (e) => {
        if (e.key === 'Enter') {
            joinChatRoom();
        }
    }

    const chatProps = {
        username: username,
        chatMessageRef: chatMessageRef,
        joinedChat: joinedChat,
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

/*TODO: 
1. When a new user connects to the server with the username - we need to tell it all the others who have already connected to the chat server.
2. Think if we want to present a new username or old one - when we leave the chat! Show the old username in the field?
3. Rethink the entire re-join chat thing? 
*/