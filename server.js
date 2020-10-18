const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (newTask) => {
    tasks.push(newTask);
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', (removedTask) => {
    tasks.filter(task => {return task.id != removedTask.id})
    socket.broadcast.emit('removeTask', removedTask);
  });
});