import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import "./App.css";

const SOCKET_URL = 'ws://localhost:8080';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userId, setUserId] = useState('user1'); // Example user ID
  const [groupId, setGroupId] = useState('group1'); // Example group ID
  const [isTyping, setIsTyping] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket(`${SOCKET_URL}?user_id=${userId}&group_id=${groupId}`, {
    onOpen: () => console.log('Connected to WebSocket'),
    onMessage: (event) => {
      const newMessage = JSON.parse(event.data);
      setChat((prevChat) => [...prevChat, newMessage]);
    },
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newMessage = JSON.parse(lastMessage.data);
      setChat((prevChat) => [...prevChat, newMessage]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    sendMessage(JSON.stringify({ type: 'text', user_id: userId, group_id: groupId, message }));
    setMessage('');
    setIsTyping(false);
  };

  const handleTyping = () => {
    setIsTyping(true);
    sendMessage(JSON.stringify({ type: 'typing', user_id: userId, group_id: groupId, is_typing: true }));
  };

  const handleSendImage = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    formData.append('group_id', groupId);

    try {
      const response = await axios.post('http://localhost:4567/upload', formData);
      const imageUrl = response.data.url;
      sendMessage(JSON.stringify({ type: 'image', user_id: userId, group_id: groupId, image_url: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className='use-align-center use-full-screen use-background'>
      <div className='chat-container'>

        <h1>Chat</h1>
        <div className='chat-messages'>
          {chat.map((msg, index) => (
            <div key={index}>
              {msg.type === 'text' && <p>{msg.message}</p>}
              {msg.type === 'image' && <img src={msg.image_url} alt="Chat" style={{ maxWidth: '200px' }} />}
              {msg.type === 'typing' && msg.is_typing && <p>{msg.user_id} is typing...</p>}
            </div>
          ))}
        </div>
        <div className='chat-input-container'>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
          />
          <button onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN}>
            Send
          </button>
          {/* <input type="file" onChange={handleSendImage} /> */}
        </div>
      </div>

    </div>
  );
}

export default App;
