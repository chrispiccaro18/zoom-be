require('dotenv').config();
const { Router } = require('express');
const request = require('superagent');
const Token = require('../models/Token');
const { Base64 } = require('js-base64');

module.exports = Router()
  .get('/:code', async(req, res, next) => {
    const { code } = req.params;
    try {
      const {
        ZOOM_AUTH_BASE_URL,
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI,
      } = process.env;

      const queryParams = `?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`;
      const authorization = Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

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
      // add expires_in and convert to epoch
      const expires_at = now.setSeconds(now.getSeconds() + expires_in);

      const token = {
        _id: code,
        code,
        access_token,
        expires_at,
        expires_in,
        refresh_token,
        scope,
        token_type,
      };

      await Token.create(token);

      // const auth = `Bearer ${access_token}`;
      // const response = await request
      //   .get('https://api.zoom.us/v2/users/me')
      //   .set('Authorization', auth);

      res.send({ authStatus: 'success' });

    } catch(e) {
      console.error(e);
      next(e);
    }

  });

