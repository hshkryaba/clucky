const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const Vote = require('../models/vote.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'answer', 'user_id', 'question_id'];

router.use(auth(config.jwt.access));

router.get('/answers', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findAll({
    attributes,
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((answers) => {
    if (answers.length) {
      formattedSend(
        200,
        answers,
        'Answers was found',
        false
      );
    } else {
      let err = new Error('Answers was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/answers/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findById(req.params.id, { attributes })
    .then((answer) => {
      if (answer) {
        formattedSend(
          200,
          answer,
          'Answer was found',
          false
        );
      } else {
        let err = new Error('Answer was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.get('/answers/:id(\\d+)/votes', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Vote.findAll({
    where: { answer_id: req.params.id },
    attributes: ['id', 'vote'],
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((votes) => {
    if (votes.length) {
      formattedSend(
        200,
        votes,
        'Votes was found',
        false
      );
    } else {
      let err = new Error('Votes was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/answers/:id(\\d+)/votes/counts', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  const Sequelize = Answer.sequelize;
  const { QueryTypes } = Sequelize;
  Sequelize.query(
    `SELECT votes.vote , COUNT(*) AS count FROM votes 
    JOIN answers ON votes.answer_id = answers.id 
    JOIN questions ON answers.question_id = questions.id 
    WHERE questions.id = ? GROUP BY votes.vote;`,
    { replacements: [req.params.id], type: QueryTypes.SELECT }
  ).then((counts) => {
    if (counts.length) {
      formattedSend(
        200,
        counts,
        'Votes was found',
        counts
      );
    } else {
      let err = new Error('Votes was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/answers/:id(\\d+)/user', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findById(req.params.id, {
    include: [{ model: User, attributes: ['id', 'login', 'email', 'status'] }],
    attributes
  }).then((answer) => {
    if (answer) {
      formattedSend(
        200,
        answer.user,
        'User was found',
        false
      );
    } else {
      let err = new Error('Answer was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/answers/:id(\\d+)/question', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findById(req.params.id, {
    include: [{ model: Question, attributes: ['id', 'subject', 'question', 'views'] }],
    attributes
  }).then((answer) => {
    if (answer) {
      formattedSend(
        200,
        answer.question,
        'Question was found',
        false
      );
    } else {
      let err = new Error('Answer was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/answers/:id(\\d+)/votes/users/:uid(\\d+)/like', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Vote.findOrCreate({
    where: { user_id: req.params.uid },
    attributes: ['id', 'vote', 'answer_id', 'user_id'],
    defaults: {
      vote: 'like',
      answer_id: req.params.id,
      user_id: req.params.uid
    }
  }).then(([votes, created]) => {
    let { id, vote, answer_id, user_id } = votes;
    if (created) {
      formattedSend(
        201,
        { id, vote, answer_id, user_id },
        'User was successfully voted',
        false
      );
    } else {
      let err = new Error('User already voted');
      formattedSend(400, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/answers/:id(\\d+)/votes/users/:uid(\\d+)/dislike', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Vote.findOrCreate({
    where: { user_id: req.params.uid },
    attributes: ['id', 'vote', 'answer_id', 'user_id'],
    defaults: {
      vote: 'dislike',
      answer_id: req.params.id,
      user_id: req.params.uid
    }
  }).then(([votes, created]) => {
    let { id, vote, answer_id, user_id } = votes;
    if (created) {
      formattedSend(
        201,
        { id, vote, answer_id, user_id },
        'User was successfully voted',
        false
      );
    } else {
      let err = new Error('User already voted');
      formattedSend(400, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/answers', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Answer.create(req.body)
    .then(({ id, answer, user_id, question_id }) => {
      formattedSend(
        201,
        { id, answer, user_id, question_id },
        'New answer was successfully created',
        false
      );
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.put('/answers/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findById(req.params.id)
    .then((answer) => {
      if (answer) {
        if (req.authPayload.id !== +answer.user_id) {
          let err = new Error('Сan not update answer of another user');
          formattedSend(403, err);
          return;
        }
        return answer.update(req.body)
          .then(({ id, answer, user_id, question_id }) => {
            formattedSend(
              200,
              { id, answer, user_id, question_id },
              'Answer was successfully updated',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Answer was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.delete('/answers/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findById(req.params.id)
    .then((answer) => {
      if (answer) {
        if (req.authPayload.id !== +answer.user_id) {
          let err = new Error('Сan not delete question of another user');
          formattedSend(403, err);
          return;
        }
        return answer.destroy()
          .then(({ id, answer, user_id, question_id }) => {
            formattedSend(
              200,
              { id, answer, user_id, question_id },
              'Answer was successfully deleted',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Answer was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

module.exports = router;
