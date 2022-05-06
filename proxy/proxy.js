const { WebSocket,WebSocketServer}  = require('ws');

//proxies request

const wss = new WebSocketServer({ port: 7560 });

wss.binaryType = 'arraybuffer';
let camera ;
let takingPhoto = false;
let initiatingClient;

wss.on('connection', function connection(ws) {
  console.log("conneciton")
  ws.on('open', function open() {
    ws.send('message',"hello");
  });

  ws.on('message', function message(data) { //iamacamera
    if(data.toString()==="iamacamera"){
      console.log('received: %s', data);
      camera = ws;
    }
    else if(data.toString()==="iwantphoto"){

      console.log('received on proxy: %s', data);
      takingPhoto = true;
      initiatingClient = ws;
      camera.send("iwantphoto")
    }
    else{   //must be photo
      console.log("forwarding photo"+ typeof data)
      console.log(data)
      initiatingClient.send(data.toString('base64'))
    }
  });

});

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
var serve = serveStatic('client', { index: ['qr.html'] })

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(756)