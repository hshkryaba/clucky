const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const { Op } = require('sequelize');
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'login', 'email', 'status'];

router.use(auth(config.jwt.access));

router.get('/users', (req, res, next) => {
  User.findAll({
    attributes,
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((users) => {
    if (users.length) {
      res.status(200).json({
        status: 200,
        message: 'Users was found',
        result: users,
        error: null
      });
    } else {
      let err = new Error('Users was not found');
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

router.get('/users/:id(\\d+)', (req, res, next) => {
  User.findById(req.params.id, { attributes }).then((user) => {
    if (user) {
      res.status(200).json({
        status: 200,
        message: 'User was found',
        result: [user],
        error: null
      });
    } else {
      let err = new Error('User was not found');
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

router.get('/users/:id(\\d+)/answers', (req, res, next) => {
  Answer.findAll({
    where: { user_id: req.params.id },
    attributes: ['id', 'answer'],
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

router.get('/users/:id(\\d+)/questions', (req, res, next) => {
  Question.findAll({
    where: { user_id: req.params.id },
    attributes: ['id', 'subject', 'question', 'views'],
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((questions) => {
    if (questions.length) {
      res.status(200).json({
        status: 200,
        message: 'Questions was found',
        result: questions,
        error: null
      });
    } else {
      let err = new Error('Questions was not found');
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

router.post('/users', (req, res, next) => {
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

router.put('/users/:id(\\d+)', (req, res, next) => {
  if (req.authPayload.id !== +req.params.id) {
    let err = new Error('Сan not update account of another user');
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
  User.findById(req.params.id).then((user) => {
    if (user) {
      return user.update(req.body).then((user) => {
        let { id, login, email, status } = user;
        res.status(200).json({
          status: 200,
          message: 'User data was successfully updated',
          result: [{ id, login, email, status }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User was not found');
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

router.delete('/users/:id(\\d+)', (req, res, next) => {
  if (req.authPayload.id !== +req.params.id) {
    let err = new Error('Сan not delete account of another user');
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
  User.findById(req.params.id).then((user) => {
    if (user) {
      return user.destroy().then((user) => {
        let { id, login, email, status } = user;
        res.status(200).json({
          status: 200,
          message: 'User was successfully deleted',
          result: [{ id, login, email, status }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('User was not found');
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
