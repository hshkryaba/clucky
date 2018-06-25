const config = require('../config');
const express = require('express');
const router = express.Router();
// const Answer = require('../models/answer.js');
const Vote = require('../models/vote.js')
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'vote', 'answer_id'];

router.use(auth(config.jwt.access));

router.get('/votes', (req, res, next) => {
  Vote.findAll({
    attributes,
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((votes) => {
    if (votes.length) {
      res.status(200).json({
        status: 200,
        message: 'Votes was found',
        result: votes,
        error: null
      });
    } else {
      let err = new Error('Votes was not found');
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
    res.status(500).json({
      status: 500,
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
