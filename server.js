const express = require('express');
const socket = require('socket.io');
const path = require('path');

const app = express();

let tasks = [
  { id: 1, name: 'Shopping' }, 
  { id: 2, name: 'Go out with a dog' }
];

app.use(express.static(path.join(__dirname, '/client')));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {

  socket.emit('updateData', tasks);
  console.log('all tasks: ', tasks);

  socket.on('addTask', (task) => {
    console.log('New task added: ',  task);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (removedTask) => {
    console.log('Task with index ',  removedTask, ' removed');
    tasks = tasks.filter(task => {return task.id !== removedTask.id})
    socket.broadcast.emit('removeTask', removedTask);
  });
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});