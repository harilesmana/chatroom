document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const room = 'defaultRoom';
  socket.emit('joinRoom', { room });

  const form = document.getElementById('chat-form');
  const input = document.getElementById('message');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('chatMessage', { room, message: input.value });
    input.value = '';
  });

  socket.on('message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
  });
});
