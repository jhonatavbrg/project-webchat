const socket = window.io();
console.log(socket);
const nicknameBox = document.querySelector('.nickname-box');
const nicknameButton = document.querySelector('.nickname-button');
const onlineUsersContainer = document.querySelector('.online-users-container');
const messagesHistoryContainer = document.querySelector('.messages-history-container');
const messageBox = document.querySelector('.message-box');
const messageButton = document.querySelector('.send-button');

let id = '';
let nickname = '';

const renderChatUsers = async (users) => {
  onlineUsersContainer.innerHTML = '';

  Object.entries(users).forEach((user) => {
    if (user[0] === id) {
      const userNickname = document.createElement('li');
      userNickname.dataset.testid = 'online-user';
      userNickname.innerText = user[1].nickname;
      onlineUsersContainer.appendChild(userNickname);
    }
  });

  Object.entries(users).forEach((user) => {
    if (user[0] !== id) {
      const chatNickname = document.createElement('li');
      chatNickname.dataset.testid = 'online-user';
      chatNickname.innerText = user[1].nickname;
      onlineUsersContainer.appendChild(chatNickname);
    }
  });
};

const renderNewMessage = async (characters) => {
  const message = document.createElement('li');
  message.dataset.testid = 'message';
  message.innerText = characters;
  return messagesHistoryContainer.appendChild(message);
};

const renderHistory = async (history) => {
  history.forEach((message) => {
    renderNewMessage(`${message.timestamp} - ${message.nickname}: ${message.message}`);
  });
};

socket.on('connect', () => {
  id = socket.id;
  nickname = socket.id.slice(0, 16);
  socket.emit('newChatUser', nickname);
});

nicknameButton.addEventListener('click', () => {
  nickname = nicknameBox.value;
  socket.emit('updateNickname', { id, nickname });
  nicknameBox.value = '';
});

messageButton.addEventListener('click', () => {
  socket.emit('message', { chatMessage: messageBox.value, nickname });
  messageBox.value = '';
});

socket.on('message', (message) => renderNewMessage(message));
socket.on('usersOnline', (usersOnline) => renderChatUsers(usersOnline));
socket.on('history', (history) => renderHistory(history));
