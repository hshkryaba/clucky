const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const { Op } = require('sequelize');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'login', 'email', 'status'];

router.use(auth(config.jwt.access));

router.get('/users', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  User.findAll({
    attributes,
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((users) => {
    if (users.length) {
      formattedSend(
        200,
        users,
        'Users was found',
        false
      );
    } else {
      let err = new Error('Users was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/users/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  User.findById(req.params.id, { attributes })
    .then((user) => {
      if (user) {
        formattedSend(
          200,
          user,
          'User was found',
          false
        );
      } else {
        let err = new Error('User was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.get('/users/:id(\\d+)/answers', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findAll({
    where: { user_id: req.params.id },
    attributes: ['id', 'answer'],
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

router.get('/users/:id(\\d+)/questions', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findAll({
    where: { user_id: req.params.id },
    attributes: ['id', 'subject', 'question', 'views'],
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((questions) => {
    if (questions.length) {
      formattedSend(
        200,
        questions,
        'Questions was found',
        false
      );
    } else {
      let err = new Error('Questions was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/users', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  let login = req.body.login;
  let password = req.body.password;
  let email = req.body.email;
  User.findOrCreate({
    where: { [Op.or]: { login, email } },
    attributes,
    defaults: { login, password, email }
  }).then(([user, created]) => {
    let { id, login, email, status } = user;
    if (created) {
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
    formattedSend(500, err);
  });
});

router.put('/users/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  if (req.authPayload.id !== +req.params.id) {
    let err = new Error('Сan not update account of another user');
    formattedSend(403, err);
    return;
  }
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        return user.update(req.body)
          .then((user) => {
            let { id, login, email, status } = user;
            formattedSend(
              200,
              { id, login, email, status },
              'User data was successfully updated',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('User was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.delete('/users/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  if (req.authPayload.id !== +req.params.id) {
    let err = new Error('Сan not delete account of another user');
    formattedSend(403, err);
    return;
  }
  User.findById(req.params.id).then((user) => {
    if (user) {
      return user.destroy()
        .then((user) => {
          let { id, login, email, status } = user;
          formattedSend(
            200,
            { id, login, email, status },
            'User was successfully deleted',
            false
          );
        }).catch((err) => {
          throw err;
        });
    } else {
      let err = new Error('User was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

module.exports = router;
