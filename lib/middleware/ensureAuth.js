const Token = require('../models/Token');
const getRefreshToken = require('./getRefreshToken');

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
    } else {
    // if it has expired, refresh
      const updatedTokenInfo = await getRefreshToken(code, tokenInfo);
      req.token = updatedTokenInfo.access_token;
      next();
    }
  } catch(err) {
    next(err);
  }
};
