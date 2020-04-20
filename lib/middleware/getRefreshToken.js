const request = require('superagent');
const { Base64 } = require('js-base64');
const Token = require('../models/Token');

module.exports = async(code, tokenInfo) => {
  const {
    ZOOM_AUTH_BASE_URL,
    CLIENT_ID,
    CLIENT_SECRET
  } = process.env;

  const queryParams = `?grant_type=refresh_token&refresh_token=${tokenInfo.refresh_token}`;
  const authorization = Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  // post to zoom auth API with the following in url query params
  // grant_type	Value `refresh_token`.
  // refresh_token	Your refresh token.
  // Header must have Authorization with Basic
  
  const authResponse = await request
    .post(`${ZOOM_AUTH_BASE_URL}${queryParams}`)
    .set('Authorization', `Basic ${authorization}`);

  const {
    access_token,
    expires_in,
    refresh_token,
    scope, 
    token_type,
  } = JSON.parse(authResponse.text);

  const now = new Date();
  const expires_at = now.setSeconds(now.getSeconds() + expires_in);

  return await Token.findByIdAndUpdate(
    code,
    {
      access_token,
      expires_at,
      expires_in,
      refresh_token,
      scope,
      token_type,
    },
    { new: true }
  );
};
