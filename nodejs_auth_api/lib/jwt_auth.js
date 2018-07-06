const config = require('../config');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const getFormattedSender = require('../lib/formatted_sender.js');

module.exports = (authConf) => {
  return (req, res, next) => {
    const formattedSend = getFormattedSender(res);
    let atoken = (
      req.headers['authorization'] &&
      req.headers['authorization']
        .split(/\s+/)[0]
        .toLowerCase() === 'bearer'
    )
      ? req.headers['authorization'].split(/\s+/)[1]
      : null;
    let xtoken = (req.headers['x-access-token'])
      ? req.headers['x-access-token']
      : null;
    let token = atoken || xtoken;
    req.tokenPayload = null;
    jwt.verify(token, config.jwt.key, authConf, (err, payload) => {
      if (err) {
        res.header('WWW-Authenticate', 'Bearer');
        formattedSend(401, err);
      } else {
        let stateHash = crypto.createHmac('sha256', config.crypto.key)
          .update(config.crypto.salt + req.headers['user-agent'] + req.ip)
          .digest('hex');
        if (payload.stateHash !== stateHash) {
          err = new Error('Not valid connection state');
          res.header('WWW-Authenticate', 'Bearer');
          formattedSend(401, err);
        } else {
          req.authPayload = payload;
          req.authPayload.tokenHash = Buffer.from(token.split('.')[2], 'base64').toString('hex');
          next();
        }
      }
    });
  };
};
