const express = require('express');
const moment = require('moment');
require('dotenv').config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const chat = require('./models/chat');

const { PORT = 3000 } = process.env;

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.render('index'));

const users = {};
// ref. https://momentjs.com/
const timestamp = moment().format('DD-MM-YYYY h:mm:ss a');

io.on('connection', (socket) => {
  socket.on('newChatUser', async (nickname) => {
    socket.emit('history', await chat.getHistory());
    users[socket.id] = { nickname };
    io.emit('usersOnline', users);
  });

  socket.on('updateNickname', (user) => {
    users[user.id].nickname = user.nickname;
    io.emit('usersOnline', users);
  });

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    await chat.savedHistory({ message: chatMessage, nickname, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('usersOnline', users);
  });
});

server.listen(PORT, () => console.log(`running on port ${PORT}`));
