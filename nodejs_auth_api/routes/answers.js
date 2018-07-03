const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const Vote = require('../models/vote.js')
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'answer', 'user_id', 'question_id'];

router.use(auth(config.jwt.access));

router.get('/answers', (req, res, next) => {
  Answer.findAll({
    attributes,
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((answers) => {
    if (answers.length) {
      res.status(200).json({
        status: 200,
        message: 'Answers was found',
        result: answers,
        error: null
      });
    } else {
      let err = new Error('Answers was not found');
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

router.get('/answers/:id(\\d+)', (req, res, next) => {
  Answer.findById(req.params.id, { attributes }).then((answer) => {
    if (answer) {
      res.status(200).json({
        status: 200,
        message: 'Answer was found',
        result: [answer],
        error: null
      });
    } else {
      let err = new Error('Answer was not found');
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

router.get('/answers/:id(\\d+)/votes', (req, res, next) => {
  Vote.findAll({
    where: { answer_id: req.params.id },
    attributes: ['id', 'vote'],
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

router.get('/answers/:id(\\d+)/votes/counts', (req, res, next) => {
  const Sequelize = Answer.sequelize;
  const { QueryTypes } = Sequelize;
  Sequelize.query(
    `SELECT votes.vote , COUNT(*) AS count FROM votes JOIN answers ON votes.answer_id = answers.id JOIN questions 
    ON answers.question_id = questions.id WHERE questions.id = ? GROUP BY votes.vote;`,
    { replacements: [req.params.id], type: QueryTypes.SELECT }
  ).then((counts) => {
    if (counts.length) {
      res.status(200).json({
        status: 200,
        message: 'Votes was found',
        result: counts,
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

router.get('/answers/:id(\\d+)/user', (req, res, next) => {
  Answer.findById(req.params.id, {
    include: [{ model: User, attributes: ['id', 'login', 'email', 'status'] }],
    attributes
  }).then((answer) => {
    if (answer) {
      res.status(200).json({
        status: 200,
        message: 'User was found',
        result: [answer.user],
        error: null
      });
    } else {
      let err = new Error('Answer was not found');
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

router.get('/answers/:id(\\d+)/question', (req, res, next) => {
  Answer.findById(req.params.id, {
    include: [{ model: Question, attributes: ['id', 'subject', 'question', 'views'] }],
    attributes
  }).then((answer) => {
    if (answer) {
      res.status(200).json({
        status: 200,
        message: 'Question was found',
        result: [answer.question],
        error: null
      });
    } else {
      let err = new Error('Answer was not found');
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

router.post('/answers/:id(\\d+)/votes/users/:uid(\\d+)/like', (req, res, next) => {
  Vote.findOrCreate({
    where: { user_id: req.params.uid },
    attributes: ['id', 'vote', 'answer_id', 'user_id'],
    defaults: {
      vote: 'like',
      answer_id: req.params.id,
      user_id: req.params.uid
    }
  }).then(([votes, created]) => {
    let { id, vote, answer_id, user_id } = votes
    if (created) {
      res.status(201).json({
        status: 201,
        message: 'User was successfully voted',
        result: [{ id, vote, answer_id, user_id }],
        error: null
      });
    } else {
      let err = new Error('User already voted');
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
    console.log(err);
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

router.post('/answers/:id(\\d+)/votes/users/:uid(\\d+)/dislike', (req, res, next) => {
  Vote.findOrCreate({
    where: { user_id: req.params.uid },
    attributes: ['id', 'vote', 'answer_id', 'user_id'],
    defaults: {
      vote: 'dislike',
      answer_id: req.params.id,
      user_id: req.params.uid
    }
  }).then(([votes, created]) => {
    let { id, vote, answer_id, user_id } = votes
    if (created) {
      res.status(201).json({
        status: 201,
        message: 'User was successfully voted',
        result: [{ id, vote, answer_id, user_id }],
        error: null
      });
    } else {
      let err = new Error('User already voted');
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
    console.log(err);
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

router.post('/answers', (req, res, next) => {
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Answer.create(req.body).then(({ id, answer, user_id, question_id }) => {
    res.status(201).json({
      status: 201,
      message: 'New answer was successfully created',
      result: [{ id, answer, user_id, question_id }],
      error: null
    });
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

router.put('/answers/:id(\\d+)', (req, res, next) => {
  Answer.findById(req.params.id).then((answer) => {
    if (answer) {
      if (req.authPayload.id !== +answer.user_id) {
        let err = new Error('Сan not update answer of another user');
        res.status(403).json({
          status: 403,
          message: null,
          result: null,
          error: {
            code: err.code || -1,
            message: err.message || 'UNKNOWN ERROR'
          }
        });
        return;
      };
      return answer.update(req.body).then(({ id, answer, user_id, question_id }) => {
        res.status(200).json({
          status: 200,
          message: 'Answer was successfully updated',
          result: [{ id, answer, user_id, question_id }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Answer was not found');
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

router.delete('/answers/:id(\\d+)', (req, res, next) => {
  Answer.findById(req.params.id).then((answer) => {
    if (answer) {
      if (req.authPayload.id !== +answer.user_id) {
        let err = new Error('Сan not delete question of another user');
        res.status(403).json({
          status: 403,
          message: null,
          result: null,
          error: {
            code: err.code || -1,
            message: err.message || 'UNKNOWN ERROR'
          }
        });
        return;
      };
      return answer.destroy().then(({ id, answer, user_id, question_id }) => {
        res.status(200).json({
          status: 200,
          message: 'Answer was successfully deleted',
          result: [{ id, answer, user_id, question_id }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Answer was not found');
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
