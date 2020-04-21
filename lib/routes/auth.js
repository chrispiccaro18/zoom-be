const { Router } = require('express');
const Token = require('../models/Token');
const User = require('../models/User');
const { getNewToken } = require('../services/zoom-auth-api');
const { getUserMe } = require('../services/zoom-api');

module.exports = Router()
  .get('/:code', async(req, res, next) => {
    const { code } = req.params;
    // TODO: handle no code
    try {
      const now = new Date();
      
      const authResponse = await getNewToken(code);
      
      const {
        access_token,
        expires_in,
        refresh_token,
        scope,
        token_type,
      } = authResponse.body;
      const expires_at = now.setSeconds(now.getSeconds() + expires_in);

      const token = await Token.create({
        _id: code,
        code,
        access_token,
        expires_at,
        expires_in,
        refresh_token,
        scope,
        token_type,
      });

      const userResponse = await getUserMe(access_token);

      const { id, email } = userResponse.body;

      await User.create({
        zoomId: id,
        email,
        token: token._id,
      });

      res.send({ authStatus: 'success' });
      
    } catch(e) {
      console.error(e);
      next(e);
    }
  });

