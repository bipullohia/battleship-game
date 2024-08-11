import { useState } from "react";
import { websocketService } from '../../store'
import { WS_CONFIG } from "../../utils/constants";

const ChatBox = ({ chatProps }) => {
    const { username, chatMessageRef, joinedChat, messages
    } = chatProps;
    const [chatMessage, setChatMessage] = useState('');

    const sendChatMessage = () => {
        websocketService.sendMessage(WS_CONFIG.WRITE_PATH_CHAT, { 
            'sender': username,
            'type': 'MSG',
            'content': chatMessage 
        });
        
        setChatMessage('');
        chatMessageRef.current.value = '';
        chatMessageRef.current.focus();
    }

    const handleEnterForMessageSent = (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    }

    if (messages.length > 0) {
        return (
            <div className="card mb-2 p-2 h-100">
                <div className="card-body px-4 overflow-auto">
                    {messages.map((receivedMsg, index) => {
                        if (receivedMsg.type === 'MSG') {
                            //if the user is sending the msg, that should display to the right. If the message is from someone else it's rendered on the left
                            if (receivedMsg.sender === username) {
                                return <p className="fst-normal chat-text text-end mb-1" key={index}>
                                    <span className='text-secondary'>You: </span>{receivedMsg.content}</p>
                            } else {
                                return <p className="fst-normal chat-text text-start mb-1" key={index}>
                                    <span className='text-secondary'>{receivedMsg.sender}:  </span>{receivedMsg.content}</p>
                            }
                        } else if (receivedMsg.type === 'JOIN') {
                            return <p className="fst-italic fw-lighter text-muted text-center chat-notification mb-2 mt-1" key={index}>
                                @{receivedMsg.sender} has joined the chat!</p>
                        } else if (receivedMsg.type === 'LEAVE') {
                            return <p className="fst-italic fw-lighter text-muted text-center chat-notification mb-2 mt-1" key={index}>
                                @{receivedMsg.sender} has left the chat!</p>
                        } else {
                            console.log(`Wrong msg type: ${receivedMsg.type}. Ignoring this!`)
                            return <div />
                        }
                    })}
                </div>
                <div className={joinedChat ? 'input-group p-2' : 'd-none'}>
                    <input type="text" className="form-control" placeholder="Type your message..." aria-label="Type your message..." aria-describedby="input-chat-message"
                        defaultValue={chatMessage} ref={chatMessageRef} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={handleEnterForMessageSent}>
                    </input>
                    <button className="btn btn-success" type="button" id="button-chat-send" onClick={sendChatMessage} disabled={!chatMessage.trim()}>Send</button>
                </div>
            </div>
        )
    } else return null;

}

export default ChatBox;