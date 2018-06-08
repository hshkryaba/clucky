const config = require('../config');
const express = require('express');
const router = express.Router();
const db = require('../db/db_sequelize_connection');
// const dbc = require('./db/db_ntive_connection');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const emailValidator = /(?=^.{5,255}$)(?!\.)([\w]|\.(?![.@]))+@(?!\.)([\w]|\.(?!\.))+\.[A-Za-z]{2,3}/gm;
const loginValidator = /(?=^.{4,255}$)^.+$/gm;
const passwordValidator = /(?=^.{6,255}$)^.+$/gm;

router.post('/auth/register', (req, res, next) => {
  let login = req.body.login;
  let password = req.body.password;
  let email = req.body.email;
  if (
    (login && login.search(loginValidator) !== -1) &&
    (password && password.search(passwordValidator) !== -1) &&
    (email && email.search(emailValidator) !== -1)
  ) {
    let hash = crypto.createHmac('sha256', config.crypto.key)
      .update(config.crypto.salt + password)
      .digest('hex');
    db.query('INSERT INTO `cluck`.`users` (`login`, `email`, `password_hash`, `created_at`) VALUES (:login, :email, :hash, :date);',
      { replacements: { login, hash, email, date: Date.now() }, type: Sequelize.QueryTypes.INSERT })
      .then((result) => {
        if (result[1]) {
          res.json({ message: 'New user added', userid: result[0] });
        } else {
          res.status(500).json({ auth: false, message: 'Cannot add new user' });
        }
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    res.status(400).json({ message: 'incorrect parameters were sent' });
  }
});

router.post('/auth/login', (req, res, next) => {
  let hash = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + req.body.password)
    .digest('hex');
  // let port = req.connection.remotePort || req.socket.remotePort || (req.connection.socket ? req.connection.socket.remotePort : null);
  let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  let state = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + req.headers['user-agent'] + ip)
    .digest('hex');
  db.query('SELECT * FROM `users` WHERE (`login` = :login OR `email` = :login) AND `password_hash` = :hash LIMIT 1',
    { replacements: { login: req.body.login, hash }, type: Sequelize.QueryTypes.SELECT })
    .then((users) => {
      if (users.length) {
        let [user] = users;
        let accessToken = jwt.sign({ id: user.id, state }, config.jwt.key, config.jwt.access);
        let refreshToken = jwt.sign({ id: user.id, state }, config.jwt.key, config.jwt.refresh);
        let accessTokenHash = Buffer.from(accessToken.split('.')[2], 'base64').toString('hex');
        let refreshTokenHash = Buffer.from(refreshToken.split('.')[2], 'base64').toString('hex');
        db.query('UPDATE `users` SET `access_token` = :access, `refresh_token` = :refresh WHERE `id` = :id LIMIT 1',
          { replacements: { id: user.id, access: accessTokenHash, refresh: refreshTokenHash }, type: Sequelize.QueryTypes.UPDATE })
          .then((result) => {
            res.status(200).json({
              auth: true,
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: 'User logged in'
            });
          })
          .catch((err) => {
            res.status(500).json({ auth: false, message: '', error: { code: err.code && -1, message: err.message && 'UNKNOWN ERROR' } });
          });
      } else {
        res.status(404).json({ auth: false, message: 'User not found or wrong credentials' });
      }
    })
    .catch((err) => {
      res.status(500).json({ auth: false, message: '', error: { code: err.code && -1, message: err.message && 'UNKNOWN ERROR' } });
    });
});

router.post('/auth/refresh', (req, res, next) => {
  let xtoken = req.headers['x-access-token'];
  let atoken = (req.headers['authorization']) ? req.headers['authorization'].split(/\s+/)[1] : null;
  let token = atoken || xtoken;
  let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  let state = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + req.headers['user-agent'] + ip)
    .digest('hex');
  jwt.verify(token, config.jwt.key, (err, payload) => {
    if (err || (payload.state !== state) || (payload.sub !== config.jwt.refresh.subject)) {
      res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    } else {
      let accessToken = jwt.sign({ user: payload.id, state }, config.jwt.key, config.jwt.access);
      let refreshToken = jwt.sign({ user: payload.id, state }, config.jwt.key, config.jwt.refresh);
      let accessTokenHash = Buffer.from(accessToken.split('.')[2], 'base64').toString('hex');
      let refreshTokenHash = Buffer.from(refreshToken.split('.')[2], 'base64').toString('hex');
      let tokenHash = Buffer.from(token.split('.')[2], 'base64').toString('hex');
      db.query('UPDATE `users` SET `access_token` = :access, `refresh_token` = :refresh WHERE `id` = :id AND `refresh_token` = :hash LIMIT 1',
        { replacements: { id: payload.id, access: accessTokenHash, refresh: refreshTokenHash, hash: tokenHash }, type: Sequelize.QueryTypes.UPDATE })
        .then((result) => {
          if (result[1]) {
            res.status(200).json({
              auth: true,
              accessToken: accessToken,
              refreshToken: refreshToken,
              message: 'Tokens is refreshed'
            });
          } else {
            res.status(404).json({ auth: false, message: 'Token not found or another token is valid' });
          }
        })
        .catch((err) => {
          res.status(500).json({ auth: false, message: '', error: { code: err.code && -1, message: err.message && 'UNKNOWN ERROR' } });
        });
    }
  });
});

router.post('/auth/logout', (req, res, next) => {
  let xtoken = req.headers['x-access-token'];
  let atoken = (req.headers['authorization']) ? req.headers['authorization'].split(/\s+/)[1] : null;
  let token = atoken || xtoken;
  let ip = req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  let state = crypto.createHmac('sha256', config.crypto.key)
    .update(config.crypto.salt + req.headers['user-agent'] + ip)
    .digest('hex');
  jwt.verify(token, config.jwt.key, (err, payload) => {
    if (err || (payload.state !== state) || (payload.sub !== config.jwt.access.subject)) {
      res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    } else {
      let tokenHash = Buffer.from(token.split('.')[2], 'base64').toString('hex');
      db.query('UPDATE `users` SET `access_token` = NULL, `refresh_token` = NULL WHERE `id` = :id AND `access_token` = :hash LIMIT 1',
        { replacements: { id: payload.id, hash: tokenHash }, type: Sequelize.QueryTypes.UPDATE })
        .then((result) => {
          if (result[1]) {
            res.status(200).json({
              auth: false,
              message: 'User logged out'
            });
          } else {
            res.status(404).json({ auth: false, message: 'Token not found or another token is valid' });
          }
        })
        .catch((err) => {
          res.status(500).json({ auth: false, message: '', error: { code: err.code && -1, message: err.message && 'UNKNOWN ERROR' } });
        });
    }
  });
});

module.exports = router;
