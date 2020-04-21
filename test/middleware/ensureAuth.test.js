require('../connect-db');
const Token = require('../../lib/models/Token');
const ensureAuth = require('../../lib/middleware/ensureAuth');

jest.mock('../../lib/services/zoom-auth-api/getRefreshToken.js', () => (code, tokenInfo) => {
  return {
    ...tokenInfo,
    access_token: 'another long ass string',
  };
});

describe('ensureAuth middleware', () => {
  const mockNext = jest.fn(() => {});

  const now = new Date();
  const notExpired = now.setSeconds(now.getSeconds() + 3599);
  const notExpiredToken = {
    _id: '1234',
    code: '1234',
    access_token: 'long ass string',
    expires_at: notExpired,
    expires_in: 3599,
    refresh_token: 'long ass string',
    scope: 'string list of roles',
    token_type: 'bearer',
  };

  const expired = now.setSeconds(now.getSeconds() - 6000);

  const expiredToken = {
    _id: '1233',
    code: '1233',
    access_token: 'long ass string',
    expires_at: expired,
    expires_in: 3599,
    refresh_token: 'long ass string',
    scope: 'string list of roles',
    token_type: 'bearer',
  };

  it('calls next if token is not expired', async() => {
    await Token.create(notExpiredToken);
    const req = { body: { code: '1234' } };
    await ensureAuth(req, {}, mockNext);
    expect(mockNext.mock.calls.length).toBe(1);
    // called without arguments
    expect(mockNext.mock.calls[0].length).toBe(0);
    expect(req.token).toBe('long ass string');
  });

  it('updates token and calls next if it is expired', async() => {
    await Token.create(expiredToken);
    const req = { body: { code: '1233' } };
    await ensureAuth(req, {}, mockNext);
    expect(req.token).toBe('another long ass string');
  });
});
