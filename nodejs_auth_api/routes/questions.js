const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const Category = require('../models/category.js');
const Tag = require('../models/tag.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'subject', 'question', 'views'];

router.use(auth(config.jwt.access));

router.get('/questions', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findAll({
    attributes,
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

router.get('/questions/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id, { attributes })
    .then((question) => {
      if (question) {
        formattedSend(
          200,
          question,
          'Question was found',
          false
        );
      } else {
        let err = new Error('Question was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.get('/questions/:id(\\d+)/answers', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Answer.findAll({
    where: { question_id: req.params.id },
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

router.get('/questions/:id(\\d+)/user', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id, {
    include: [{ model: User, attributes: ['id', 'login', 'email', 'status'] }],
    attributes
  }).then((question) => {
    if (question) {
      formattedSend(
        200,
        question.user,
        'User was found',
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

router.get('/questions/:id(\\d+)/categories', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id, {
    include: [{ model: Category, through: { attributes: [] }, attributes: ['id', 'name'] }],
    attributes
  }).then((question) => {
    if (question.categories.length) {
      formattedSend(
        200,
        question.categories,
        'Categories was found',
        false
      );
    } else {
      let err = new Error('Categories was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.get('/questions/:id(\\d+)/tags', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id, {
    include: [{ model: Tag, through: { attributes: [] }, attributes: ['id', 'name'] }],
    attributes
  }).then((question) => {
    if (question.tags.length) {
      formattedSend(
        200,
        question.tags,
        'Tags was found',
        false
      );
    } else {
      let err = new Error('Tags was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/questions/:id(\\d+)/views/inc', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id).then((question) => {
    if (question) {
      return question.increment('views')
        .then(({ id, subject, question, views, user_id }) => {
          formattedSend(
            200,
            { id, subject, question, views: ++views, user_id },
            'Views was successfully updated',
            false
          );
        }).catch((err) => {
          throw err;
        });
    } else {
      let err = new Error('Question was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/questions', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Question.create(req.body)
    .then(({ id, subject, question, views, user_id }) => {
      formattedSend(201,
        { id, subject, question, views, user_id },
        'New question was successfully created',
        false
      );
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.put('/questions/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id)
    .then((question) => {
      if (question) {
        if (req.authPayload.id !== +question.user_id) {
          let err = new Error('Сan not update question of another user');
          formattedSend(403, err);
          return;
        }
        return question.update(req.body)
          .then(({ id, subject, question, views, user_id }) => {
            formattedSend(
              200,
              { id, subject, question, views, user_id },
              'Question was successfully updated',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Question was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.delete('/questions/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Question.findById(req.params.id)
    .then((question) => {
      if (question) {
        if (req.authPayload.id !== +question.user_id) {
          let err = new Error('Сan not delete question of another user');
          formattedSend(403, err);
          return;
        }
        return question.destroy()
          .then(({ id, subject, question, views, user_id }) => {
            formattedSend(
              200,
              { id, subject, question, views, user_id },
              'Question was successfully deleted',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Question was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

module.exports = router;
