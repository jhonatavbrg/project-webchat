const connection = require('./connection');

const savedHistory = async (message) => {
  const db = await connection();
  await db.collection('messages').insertOne(message);
};

module.exports = {
  savedHistory,
};