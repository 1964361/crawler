// script.js
const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', (message) => {
  appendMessage(message);
});

socket.on('message history', (history) => {
  history.forEach(message => appendMessage(message));
});

function appendMessage(message) {
  const item = document.createElement('li');
  item.textContent = message.text;
  messages.appendChild(item);
  
  // Scroll to the bottom of the chat container
  messages.scrollTop = messages.scrollHeight;
}
