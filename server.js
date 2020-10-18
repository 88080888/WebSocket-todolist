const express = require('express');
const path = require("path");
const socket = require('socket.io');

const app = express();

let tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/src/index.js'));
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', (removedTask) => {
    tasks.filter(task => {return task.id !== removedTask.id})
    socket.broadcast.emit('removeTask', removedTask);
  });
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});