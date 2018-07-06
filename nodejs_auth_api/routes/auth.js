const config = require('../config');
const express = require('express');
const router = express.Router();
const { Op } = require('../db/db_sequelize_connection.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'login', 'email', 'status'];

const createTokens = (req, user) => {
  let stateHash = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + req.headers['user-agent'] + req.ip)
    .digest('hex');
  let accessToken = jwt.sign({ id: user.id, stateHash }, config.jwt.key, config.jwt.access);
  let refreshToken = jwt.sign({ id: user.id, stateHash }, config.jwt.key, config.jwt.refresh);
  let access_token_hash = Buffer.from(accessToken.split('.')[2], 'base64').toString('hex');
  let refresh_token_hash = Buffer.from(refreshToken.split('.')[2], 'base64').toString('hex');
  return {
    tokens: { accessToken, refreshToken },
    hashes: { access_token_hash, refresh_token_hash }
  };
};

router.post('/auth/register', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  let login = req.body.login;
  let password = req.body.password;
  let email = req.body.email;
  User.findOrCreate({
    where: { [Op.or]: { login, email } },
    attributes,
    defaults: { login, password, email }
  }).then(([user, created]) => {
    if (created) {
      let { id, login, email, status } = user;
      formattedSend(
        201,
        { id, login, email, status },
        'New user was successfully registered',
        false
      );
    } else {
      let err = new Error('User with this credentials already exist');
      formattedSend(400, err);
    }
  }).catch((err) => {
    formattedSend(400, err);
  });
});

router.post('/auth/login', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  let login = req.body.login || req.body.email;
  let password = req.body.password;
  let hash = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + password)
    .digest('hex');
  User.findOne({ where: { password_hash: hash, [Op.or]: { login, email: login } } }).then((user) => {
    if (user) {
      let authData = createTokens(req, user);
      return user.update(authData.hashes).then((user) => {
        formattedSend(
          200,
          authData.tokens,
          'User successfully logged in',
          false
        );
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User with this credentials not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(400, err);
  });
});

router.post('/auth/refresh', auth(config.jwt.refresh), (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  User.findOne({
    where: {
      id: req.authPayload.id,
      refresh_token_hash: req.authPayload.tokenHash
    }
  }).then((user) => {
    if (user) {
      let authData = createTokens(req, user);
      return user.update(authData.hashes).then((user) => {
        formattedSend(
          200,
          authData.tokens,
          'Auth-tokens was successfully refreshed',
          false
        );
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User logged out and this token is no longer valid');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(400, err);
  });
});

router.post('/auth/logout', auth(config.jwt.access), (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  User.findOne({
    where: {
      id: req.authPayload.id,
      access_token_hash: req.authPayload.tokenHash
    }
  }).then((user) => {
    if (user) {
      return user.update({
        access_token_hash: null,
        refresh_token_hash: null
      }).then((user) => {
        formattedSend(
          200,
          null,
          'User successfully logged out',
          false
        );
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User logged out or this token is no longer valid');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(400, err);
  });
});

module.exports = router;
