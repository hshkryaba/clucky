const config = require('../config');
const express = require('express');
const router = express.Router();
const Vote = require('../models/vote.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'vote', 'answer_id'];

router.use(auth(config.jwt.access));

router.get('/votes', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Vote.findAll({
    attributes,
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((votes) => {
    if (votes.length) {
      formattedSend(
        200,
        votes,
        'Votes was found',
        false);
    } else {
      let err = new Error('Votes was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

module.exports = router;
