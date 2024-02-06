// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat_app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a room
  socket.join('chatRoom');

  // Send message history to the new user
  Message.find().sort('-createdAt').limit(10).exec((err, messages) => {
    if (err) return console.error(err);
    socket.emit('message history', messages.reverse());
  });

  // Handle chat messages
  socket.on('chat message', async (msg) => {
    try {
      const message = new Message({ text: msg });
      await message.save();
      io.to('chatRoom').emit('chat message', message);
    } catch (error) {
      console.error(error);
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Serve static files
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
socket.on('chat message', async (msg) => {
  try {
    const message = new Message({ text: msg });
    await message.save();
    socket.to('chatRoom').emit('chat message', message);
    // Also send the message to the sender
    socket.emit('chat message', message);
  } catch (error) {
    console.error(error);
  }
});
