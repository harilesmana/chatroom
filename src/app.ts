import { Hono } from 'hono';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import roomRoutes from './routes/roomRoutes';
import serveStatic from 'serve-static';

const app = new Hono();
const server = createServer(app.server);
const io = new Server(server);

// Setup session
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
}));

// Serve static files
app.use('/static', serveStatic(path.join(__dirname, 'public')));

// Routes
app.use('/auth/*', authRoutes);
app.use('/chat/*', chatRoutes);
app.use('/room/*', roomRoutes);

// EJS view engine setup
app.get('/', async (c) => {
  const filePath = path.join(__dirname, 'views', 'index.ejs');
  return await c.html(filePath, {});
});

app.get('/login', async (c) => {
  const filePath = path.join(__dirname, 'views', 'login.ejs');
  return await c.html(filePath, {});
});

app.get('/register', async (c) => {
  const filePath = path.join(__dirname, 'views', 'register.ejs');
  return await c.html(filePath, {});
});

app.get('/chat', async (c) => {
  const filePath = path.join(__dirname, 'views', 'chat.ejs');
  return await c.html(filePath, {});
});

app.get('/room', async (c) => {
  const filePath = path.join(__dirname, 'views', 'room.ejs');
  return await c.html(filePath, {});
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
    io.to(room).emit('message', 'A user has joined the room');
  });

  socket.on('chatMessage', (msg) => {
    io.to(msg.room).emit('message', msg.message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
