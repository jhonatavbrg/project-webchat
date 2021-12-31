const connection = require('./connection');

const savedHistory = async (message) => {
  const db = await connection();
  await db.collection('messages').insertOne(message);
};

const getHistory = async () => {
  const db = await connection();
  const historic = await db.collection('messages').find().toArray();

  return historic;
};

module.exports = {
  savedHistory,
  getHistory,
};
