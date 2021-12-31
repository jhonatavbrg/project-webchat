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

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(`${__dirname}/public`));

app.get('/', (_req, res) => res.render('index'));

const users = {};
// ref. https://momentjs.com/
const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');

io.on('connection', (socket) => {
  socket.on('newChatUser', async (nickname) => {
    socket.emit('history', await chat.getHistory());
    users[socket.id] = { nickname };
    io.emit('usersOnline', users);
  });

  socket.on('message', async (userMessage) => {
    const { message, nickname } = userMessage;
    await chat.savedHistory({ nickname, message, timestamp });
    io.emit('message', `${timestamp} - ${nickname}: ${message}`);
  });
});
