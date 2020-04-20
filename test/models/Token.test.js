const Token = require('../../lib/models/Token');

describe('Token model tests', () => {
  it('has a _id, code, access token, expires at, expires in, refresh token, scope, and token type', () => {
    const now = new Date();
    const expires_at = now.setSeconds(now.getSeconds() + 3599);
    const token = new Token({
      _id: '1234',
      code: '1234',
      access_token: 'long ass string',
      expires_at,
      expires_in: 3599,
      refresh_token: 'long ass string',
      scope: 'account:master account:read:admin account:write:admin contact:read:admin meeting:master meeting:read:admin meeting:write:admin user:master user:read:admin user:write:admin webinar:master webinar:read:admin webinar:write:admin',
      token_type: 'bearer',
    });

    expect(token.toJSON()).toEqual({
      _id: '1234',
      code: '1234',
      access_token: 'long ass string',
      expires_at,
      expires_in: 3599,
      refresh_token: 'long ass string',
      scope: 'account:master account:read:admin account:write:admin contact:read:admin meeting:master meeting:read:admin meeting:write:admin user:master user:read:admin user:write:admin webinar:master webinar:read:admin webinar:write:admin',
      token_type: 'bearer',
    });
  });
});
