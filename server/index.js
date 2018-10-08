'use strict'
const http = require('http')
const app = require('./config')
//const Server = http.Server(app)
const PORT = process.env.PORT || 8001
//const io = require('socket.io')(Server)

var fs = require('fs');
var https = require('https');

var express = require('express');
//var app = express();

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};
var serverPort = 8002;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

//Server.listen(PORT, () => console.log('Game server running on:', PORT))
server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});
const players = {}

io.on('connection', socket => {
  console.log(`player ${socket.id} is connected !!`)
  socket.on('new-player', state => {
    console.log('New player joined with state:', state)
    players[socket.id] = state
    // Emit the update-players method in the client side
    io.emit('update-players', players)
  })

  socket.on('disconnect', state => {
    console.log(`player ${socket.id} disconnected !!`)
    delete players[socket.id]
    io.emit('update-players', players)
  })

  socket.on('joystick-accelerating', state => {
    io.emit('client-accelerating', state)
  });

  // When a player moves
  socket.on('move-player', data => {
    const { x, y, angle, playerName, speed } = data

    // If the player is invalid, return
    if (players[socket.id] === undefined) {
      return
    }

    // Update the player's data if he moved
    players[socket.id].x = x
    players[socket.id].y = y
    players[socket.id].angle = angle
    players[socket.id].playerName = {
      name: playerName.name,
      x: playerName.x,
      y: playerName.y
    }
    players[socket.id].speed = {
      value: speed.value,
      x: speed.x,
      y: speed.y
    }

    // Send the data back to the client
    io.emit('update-players', players)
  })
})
