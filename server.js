var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server =http.Server(app);
var io = socketIO(server);

app.set('port',5000);
app.use('/static',express.static(__dirname + '/static'));

app.get('/',(request,response)=>{
    response.sendFile(path.join(__dirname,'/static/index.html'));
})


server.listen(5000,()=>console.log("connected"));


//sockets
var users = {};
io.on('connection',(socket)=>{
   socket.on('new user',()=>{
       users[socket.id]={
           xPoints : [],
           yPoints : [] ,
           dragging:[],
           paint:false,
           mode:1
       };
   });
   socket.on('movement',(data)=>{
       var user  = users[socket.id]||{};
       user.xPoints = data.xPoints ;
       user.yPoints = data.yPoints;
       user.dragging = data.dragging;
       user.paint = data.paint;
       user.mode = data.mode;
   });
})
setInterval(()=>{io.sockets.emit('data',users)},1000/60);
