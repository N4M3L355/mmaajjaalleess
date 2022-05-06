const { WebSocket,WebSocketServer}  = require('ws');
const {promises:fs} = require("fs")
const yeetor = require("../yeet");
//runs where the camera is

const ws = new WebSocket('ws://minecraft.xn--krl-fla.com:7560');

ws.on('open', () => {
  ws.send("iamacamera")

});

ws.on('message',async (data) => {  //iwantphoto
  console.log('received: %s', data);
  if(data.toString()==="iwantphoto"){
    path = await yeetor()
    file = await fs.readFile(path);
    ws.send(file)
  }
});