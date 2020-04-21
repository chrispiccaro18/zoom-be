require('../connect-db');
const mongoose = require('mongoose');
const User = require('../../lib/models/User');
const Token = require('../../lib/models/Token');

describe('User model tests', () => {
  it('has a zoomId, email, and token ref', async() => {
    const now = new Date();
    const expires_at = now.setSeconds(now.getSeconds() + 3599);
    const token = await Token.create({
      _id: '1234',
      code: '1234',
      access_token: 'long ass string',
      expires_at,
      expires_in: 3599,
      refresh_token: 'long ass string',
      scope: 'account:master account:read:admin account:write:admin contact:read:admin meeting:master meeting:read:admin meeting:write:admin user:master user:read:admin user:write:admin webinar:master webinar:read:admin webinar:write:admin',
      token_type: 'bearer',
    });

    const user = await User.create({
      zoomId: 'random string',
      email: 'test@test.com',
      token: token._id,
    });

    expect(user.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      zoomId: 'random string',
      email: 'test@test.com',
      token: token._id,
      __v: 0,
    });
  });
});
