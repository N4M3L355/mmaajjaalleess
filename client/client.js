const { WebSocket,WebSocketServer}  = require('ws');

//requests a photo

const ws = new WebSocket('ws://minecraft.xn--krl-fla.com:7560');
ws.on('open', () => {
  ws.send("iwantphoto")

  ws.on('message', (data) => {  //iwantphoto
    console.log('received: %s', data);
  });
});
