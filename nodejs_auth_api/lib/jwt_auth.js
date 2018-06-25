const config = require('../config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = (authConf) => {
  return (req, res, next) => {
    let atoken = (req.headers['authorization'] && req.headers['authorization'].split(/\s+/)[0].toLowerCase() === 'bearer')
      ? req.headers['authorization'].split(/\s+/)[1]
      : null;
    let xtoken = (req.headers['x-access-token']) ? req.headers['x-access-token'] : null;
    let token = atoken || xtoken;
    req.tokenPayload = null;
    jwt.verify(token, config.jwt.key, authConf, (err, payload) => {
      if (err) {
        res.header('WWW-Authenticate', 'Bearer');
        res.status(401).json({
          status: 401,
          message: null,
          result: null,
          error: {
            code: err.code || -1,
            message: err.message || 'UNKNOWN ERROR'
          }
        });
      } else {
        let stateHash = crypto.createHmac('sha256', config.crypto.key)
          .update(config.crypto.salt + req.headers['user-agent'] + req.ip)
          .digest('hex');
        if (payload.stateHash !== stateHash) {
          err = new Error('Not valid connection state');
          res.header('WWW-Authenticate', 'Bearer');
          res.status(401).json({
            status: 401,
            message: null,
            result: null,
            error: {
              code: err.code || -1,
              message: err.message || 'UNKNOWN ERROR'
            }
          });
        } else {
          req.authPayload = payload;
          req.authPayload.tokenHash = Buffer.from(token.split('.')[2], 'base64').toString('hex');
          next();
        }
      }
    });
  }
}
