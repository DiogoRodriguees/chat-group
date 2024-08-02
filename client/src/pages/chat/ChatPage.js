
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatMessage from '../../components/chat/ChatMessage';

const SOCKET_URL = 'ws://localhost:8080';
// const SOCKET_URL = 'ws://2.tcp.ngrok.io:13690';

export default function ChatPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const scrollRef = useRef(null);
    const chatRef = useRef(null);

    const { nickname = '', sessionCode = '', color = '#1890ff' } = (location.state || {});

    const userId = nickname;
    const groupId = sessionCode;

    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
        if (!nickname || !sessionCode) {
            navigate('/');
            return;
        }
    }, []);

    useEffect(() => {
        console.log('useEffect');
        scrollToBottom();
    }, [chat.length]);

    const receiveTypingMessage = (data) => {
        const typingMessageIndex = chat.findIndex(msg =>
            msg.type === 'typing' &&
            msg.user_id === data.user_id
        );

        console.log('index', typingMessageIndex);

        if (!data.message) {
            setChat(prev => [
                ...prev.slice(0, typingMessageIndex),
                ...prev.slice(typingMessageIndex + 1, prev.length),
            ]);
            return;
        }
    
        if (typingMessageIndex !== -1) {
            setChat(prev => [
                ...prev.slice(0, typingMessageIndex),
                data,
                ...prev.slice(typingMessageIndex + 1, prev.length),
            ]);
            return;
        }
    
        setChat((prevChat) => [...prevChat, data]);
    }

    const receiveFinalMessage = (data) => {
        const typingMessageIndex = chat.findIndex(msg =>
            msg.type === 'typing' &&
            msg.user_id === data.user_id
        );

        setChat(prev => [
            ...prev.slice(0, typingMessageIndex),
            data,
            ...prev.slice(typingMessageIndex + 1, prev.length),
        ]);
    }

    const scrollToBottom = () => {

        const offset = 96;

        const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
        const isAtBottom = scrollTop + clientHeight + offset >= scrollHeight;        

        if (!isAtBottom) return;

        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const onMessage = (data) => {

        const receiveFunctions = {
            typing: receiveTypingMessage,
            text: receiveFinalMessage,
        };

        const receiveFunction = receiveFunctions[data.type];

        if (!receiveFunction) return;

        receiveFunction(data);
    }

    const { sendMessage: sendSocketMessage, lastMessage, readyState } = useWebSocket(`${SOCKET_URL}?user_id=${userId}&group_id=${groupId}`, {
        onOpen: () => console.log('Connected to WebSocket'),
        onMessage: (event) => {
            console.log('Received Message', event.data);
            const newMessage = JSON.parse(event.data);
            onMessage(newMessage);
        },
    });

    const sendMessage = (msg) => {
        if (!msg) return;

        const messageData = {
            user_id: userId,
            group_id: groupId,
            color: color,
            ...msg,
        };

        sendSocketMessage(JSON.stringify(messageData));
    }

    const handleSendMessage = () => {
        if (!message) {
            return;
        }

        sendMessage({
            type: 'text',
            message
        });
        setMessage('');
    };

    const handleTyping = (typedMessage) => {
        setMessage(typedMessage);

        sendMessage({
            type: 'typing',
            is_typing: true,
            message: typedMessage
        });
    };

    // const handleSendImage = async (event) => {
    //     const file = event.target.files[0];
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('user_id', userId);
    //     formData.append('group_id', groupId);

    //     try {
    //         const response = await axios.post('http://localhost:4567/upload', formData);
    //         const imageUrl = response.data.url;
    //         sendMessage(JSON.stringify({ type: 'image', user_id: userId, group_id: groupId, image_url: imageUrl }));
    //     } catch (error) {
    //         console.error('Error uploading image:', error);
    //     }
    // };

    const renderChatMessage = (msg) => {
        if (msg.type === 'text' || msg.type === 'typing') {
            return (
                <ChatMessage
                    authorName={msg.user_id}
                    message={msg.message}
                    isTyping={msg.type === 'typing'}
                    isAuthor={msg.user_id === userId}
                    color={msg.color}
                />
        );
        }   
    }

    return (
        <div className='use-align-center use-full-screen use-background'>
            <div className='w-full max-w-2xl h-[90%] bg-[#f6f7f8] rounded-lg p-6 border border-[#dedede] shadow-[0_0_15px_#d4d4d4] flex flex-col'>

                <div className="text-2xl mb-6">Chat</div>
                <div ref={chatRef} className='h-full overflow-auto flex flex-col gap-4'>
                    {chat.map((msg, index) => (
                        <div key={index}>
                            {renderChatMessage(msg)}
                            {msg.type === 'image' && <img src={msg.image_url} alt="Chat" style={{ maxWidth: '200px' }} />}
                        </div>
                    ))}
                    <div ref={scrollRef}></div>
                </div>
                <div className='flex gap-3 mt-4'>
                    <div
                        className='bg-[#0001] rounded-full w-full border border-transparent hover:border-[#1890ff] focus-within:border-[#1890ff] transition-[border-color_.3s_ease]'
                    >
                        <input
                            className='py-2 px-4 bg-transparent outline-none w-full'
                            type="text"
                            value={message}
                            onChange={(e) => handleTyping(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        </div>
                    <button
                        className='px-4 py-1 rounded-full border-none bg-[#1890ff] text-white font-semibold hover:brightness-110'
                        onClick={handleSendMessage}
                        disabled={readyState !== ReadyState.OPEN}
                    >
                        Enviar
                    </button>
                    {/* <input type="file" onChange={handleSendImage} /> */}
                </div>
            </div>

        </div>
    );
}