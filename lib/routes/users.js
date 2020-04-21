const { Router } = require('express');
const request = require('superagent');
const ensureAuth = require('../middleware/ensureAuth');

module.exports = Router()
  .post('/:user', ensureAuth, async(req, res, next) => {
    const { user } = req.params;
    const { token } = req;

    try {
      const auth = `Bearer ${token}`;
      const response = await request
        .get(`https://api.zoom.us/v2/users/${user}`)
        .set('Authorization', auth);
  
      console.log(response.body);
      res.send(response.body);
    } catch(err) {
      next(err);
    }
  });
