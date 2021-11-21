import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const WebSock = () => {

  const [ messages, setMessages ] = useState([]);
  const [ value, setValue ] = useState('');
  const socket = useRef();
  const [ connected, setConnected ] = useState(false);
  const [ userName, setUserName ] = useState('');

  const sendMessage = async () => {
    const message = {
      username: userName,
      message: value,
      id: Date.now(),
      event: 'message',
      own: true,
    };
    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  function connect() {

    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        event: 'connection',
        username: userName,
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
      console.log('Connected');
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [ message, ...prev ]);
    };

    socket.current.onclose = () => {
      console.log('Socket was closed');
    };

    socket.current.onerror = () => {
      console.log('Connection Error');

    };
  }

  if ( !connected ) {
    return (
      <div>
        <div className="form">
          <input value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 type="text"
                 placeholder="Set your username" />
          <button onClick={connect}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="form">
        <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div className="messages"
           style={{ border: '2px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0', maxWidth: '300px', backgroundColor: '#ddd' }}>
        {messages.map(mess => <div className="message"

        >
          {mess.event === 'connection' ? <div>Uer {mess.username} connected</div>
            : <div
              style={{
                border: '2px solid #dedede', borderRadius: '5px', padding: '10px', margin: '10px 0', maxWidth: '300px', backgroundColor: '#f1f1f1',

              }}>{mess.username}: {mess.message}</div>
          }
        </div>)}
      </div>
    </div>
  );
};

export default WebSock;