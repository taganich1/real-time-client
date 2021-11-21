/*const ws = require('ws');*/
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 5000,
  }, () => {
    console.log('5000');
  },
);

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch ( message.event ) {
      case 'message': {
        broadCastMessage(message);
        break;
      }
      case 'connection' : {
        broadCastMessage(message);
        break;
      }
    }
  });
});

const message = {
  event: 'message/connection',
  id: 123,
  data: '21.02.2021',
  username: 'Anton',
  message: '',
};

function broadCastMessage(message) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify(message));
  });
}