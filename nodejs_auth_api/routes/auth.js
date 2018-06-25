const config = require('../config');
const express = require('express');
const router = express.Router();
const { Op } = require('../db/db_sequelize_connection');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const auth = require('../lib/jwt_auth.js');

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
  }
}

router.post('/auth/register', (req, res, next) => {
  let login = req.body.login;
  let password = req.body.password;
  let email = req.body.email;
  User.findOrCreate({
    where: { [Op.or]: { login, email } },
    attributes,
    defaults: { login, password, email }
  }).then(([user, created]) => {
    if (created) {
      res.status(201).json({
        status: 201,
        message: 'New user was successfully registered',
        result: [{ id: user.id, login, email, status: user.status }],
        error: null
      });
    } else {
      let err = new Error('User with this credentials already exist');
      res.status(400).json({
        status: 400,
        message: null,
        result: null,
        error: {
          code: err.code || -1,
          message: err.message || 'UNKNOWN ERROR'
        }
      });
    }
  }).catch((err) => {
    res.status(400).json({
      status: 400,
      message: null,
      result: null,
      error: {
        code: err.code || -1,
        message: err.message || 'UNKNOWN ERROR'
      }
    });
  });
});

router.post('/auth/login', (req, res, next) => {
  let login = req.body.login || req.body.email;
  let password = req.body.password;
  let hash = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + password)
    .digest('hex');
  User.findOne({ where: { password_hash: hash, [Op.or]: { login, email: login } } }).then((user) => {
    if (user) {
      let authData = createTokens(req, user);
      return user.update(authData.hashes).then((user) => {
        res.json({
          status: 200,
          message: 'User successfully logged in',
          result: [authData.tokens],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User with this credentials not found');
      res.status(404).json({
        status: 404,
        message: null,
        result: null,
        error: {
          code: err.code || -1,
          message: err.message || 'UNKNOWN ERROR'
        }
      });
    }
  }).catch((err) => {
    res.status(400).json({
      status: 400,
      message: null,
      result: null,
      error: {
        code: err.code || -1,
        message: err.message || 'UNKNOWN ERROR'
      }
    });
  });
});

router.post('/auth/refresh', auth(config.jwt.refresh), (req, res, next) => {
  User.findOne({
    where: {
      id: req.authPayload.id,
      refresh_token_hash: req.authPayload.tokenHash
    }
  }).then((user) => {
    if (user) {
      let authData = createTokens(req, user);
      return user.update(authData.hashes).then((user) => {
        res.json({
          status: 200,
          message: 'Auth-tokens was successfully refreshed',
          result: [authData.tokens],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User logged out and this token is no longer valid');
      res.status(404).json({
        status: 404,
        message: null,
        result: null,
        error: {
          code: err.code || -1,
          message: err.message || 'UNKNOWN ERROR'
        }
      })
    }
  }).catch((err) => {
    res.status(400).json({
      status: 400,
      message: null,
      result: null,
      error: {
        code: err.code || -1,
        message: err.message || 'UNKNOWN ERROR'
      }
    });
  });
});

router.post('/auth/logout', auth(config.jwt.access), (req, res, next) => {
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
        res.json({
          status: 200,
          message: 'User successfully logged out',
          result: null,
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User logged out or this token is no longer valid');
      res.status(404).json({
        status: 404,
        message: null,
        result: null,
        error: {
          code: err.code || -1,
          message: err.message || 'UNKNOWN ERROR'
        }
      });
    }
  }).catch((err) => {
    res.status(400).json({
      status: 400,
      message: null,
      result: null,
      error: {
        code: err.code || -1,
        message: err.message || 'UNKNOWN ERROR'
      }
    });
  });
});

module.exports = router;
