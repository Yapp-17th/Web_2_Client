require('dotenv').config();
const express = require('express');
const http = require('http');
const { userInfo } = require('os');

const app = express();
const server = http.createServer(app);
const socket = require('socket.io');

const io = socket(server);

const users = {};

const socketToRoom = {};

io.on('connection', (sock) => {
  sock.on('join room', (roomID) => {
    if (users[roomID]) {
      const { length } = users[roomID];
      if (length === 2) {
        socketToRoom.roomID = {};
        sock.emit('room full');
        return;
      }
      users[roomID].push(sock.id);
    } else {
      users[roomID] = [sock.id];
    }
    socketToRoom[sock.id] = roomID;

    const usersInThisRoom = users[roomID].filter((id) => id !== sock.id);

    sock.emit('all users', usersInThisRoom);
  });

  sock.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  sock.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: sock.id,
    });
  });

  sock.on('next', () => {
    if (
      users[socketToRoom[sock.id]]
      && users[socketToRoom[sock.id]].length <= 2
    ) {
      users[socketToRoom[sock.id]].forEach((val) => {
        io.to(val).emit('clicked');
      });
    }
  });

  sock.on('disconnect', () => {
    if (
      users[socketToRoom[sock.id]]
      && users[socketToRoom[sock.id]].length <= 2
    ) {
      users[socketToRoom[sock.id]].forEach((val) => {
        io.to(val).emit('refresh');
      });
      users[socketToRoom[sock.id]] = users[socketToRoom[sock.id]].filter(
        (val) => val !== sock.id,
      );
    }
    delete socketToRoom[sock.id];
  });
});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));
