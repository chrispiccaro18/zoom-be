require('dotenv').config();
const { Base64 } = require('js-base64');
const request = require('superagent');

module.exports = async(code) => {
  const {
    ZOOM_AUTH_BASE_URL,
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  } = process.env;

  const queryParams = `?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`;
  const authorization = Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

  return await request
    .post(`${ZOOM_AUTH_BASE_URL}${queryParams}`)
    .set('Authorization', `Basic ${authorization}`);
};
