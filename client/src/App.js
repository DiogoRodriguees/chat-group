import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const SOCKET_URL = 'ws://localhost:8080';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL, {
    onOpen: () => console.log('Connected to WebSocket'),
    onMessage: (event) => {
      const newMessage = event.data;
      setChat((prevChat) => [...prevChat, newMessage]);
    },
  });

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Send
      </button>
    </div>
  );
}

export default App;
