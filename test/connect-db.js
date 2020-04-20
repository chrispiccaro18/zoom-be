require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

beforeAll(() => {
  return connect(process.env.MONGODB_URI_TEST);
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

afterAll(() => {
  return mongoose.connection.close();
});
