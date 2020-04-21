const request = require('superagent');

module.exports = async(token) => {
  const auth = `Bearer ${token}`;
  return await request
    .get('https://api.zoom.us/v2/users/me')
    .set('Authorization', auth);
};
