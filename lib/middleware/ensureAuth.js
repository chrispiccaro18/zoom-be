const Token = require('../models/Token');
const getRefreshToken = require('../services/zoom-auth-api/getRefreshToken');

module.exports = (req, res, next) => {
  const { code } = req.body;
  return checkToken(code, req, next);
};

const checkToken = async(code, req, next) => {
  try {
    const tokenInfo = await Token.findById(code);
    const now = new Date();
  
    // check to see if auth token has expired
    if(tokenInfo.expires_at > now.getTime()) {
      // if not continue with access token in req
      req.token = tokenInfo.access_token;
      next();
      return;
    } else {
      // if it has expired - refresh, and save new token
      const updatedTokenInfo = await getRefreshToken(code, tokenInfo);
      console.log('refresh token for', code);
      const {
        access_token,
        expires_in,
        refresh_token,
        scope,
        token_type,
      } = updatedTokenInfo.body;
      const expires_at = now.setSeconds(now.getSeconds() + expires_in);

      await Token.findByIdAndUpdate(code, {
        access_token,
        expires_in,
        expires_at,
        refresh_token,
        scope,
        token_type,
      });
      req.token = access_token;
      next();
      return;
    }
  } catch(err) {
    console.error(err);
    next(err);
  }
};
