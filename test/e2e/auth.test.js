require('../connect-db');
const request = require('supertest');
const Token = require('../../lib/models/Token');
const User = require('../../lib/models/User');
const app = require('../../lib/app');

jest.mock('../../lib/services/zoom-auth-api/getNewToken.js', () => (code) => {
  return {
    body: {
      _id: code,
      code,
      access_token: 'long ass string',
      expires_at: 100090,
      expires_in: 3599,
      refresh_token: 'long ass string',
      scope: 'list of scopes',
      token_type: 'bearer',
    }
  };
});

// eslint-disable-next-line no-unused-vars
jest.mock('../../lib/services/zoom-api/getUserMe.js', () => (token) => {
  return {
    body: {
      id: 'random string',
      email: 'test@test.com',
    }
  };
});

describe('auth route', () => {
  it('returns success after receiving a valid code', async() => {
    const response = await request(app)
      .get('/api/v1/auth/testCode');
    
    expect(response.body).toEqual({
      authStatus: 'success'
    });

    const user = await User.findOne({ email: 'test@test.com' });
    const token = await Token.findById('testCode');
    expect(user && token).toBeTruthy();
  });
});
