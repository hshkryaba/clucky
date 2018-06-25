const config = require('../config');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Question = require('../models/question.js');
const Answer = require('../models/answer.js');
const Category = require('../models/category.js');
const Tag = require('../models/tag.js');
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'subject', 'question', 'views'];

router.use(auth(config.jwt.access));

router.get('/questions', (req, res, next) => {
  Question.findAll({
    attributes,
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

router.get('/questions/:id(\\d+)', (req, res, next) => {
  Question.findById(req.params.id, { attributes }).then((question) => {
    if (question) {
      res.status(200).json({
        status: 200,
        message: 'Question was found',
        result: [question],
        error: null
      });
    } else {
      let err = new Error('Question was not found');
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

router.get('/questions/:id(\\d+)/answers', (req, res, next) => {
  Answer.findAll({
    where: { question_id: req.params.id },
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

router.get('/questions/:id(\\d+)/user', (req, res, next) => {
  Question.findById(req.params.id, {
    include: [{ model: User, attributes: ['id', 'login', 'email', 'status'] }],
    attributes
  }).then((question) => {
    if (question) {
      res.status(200).json({
        status: 200,
        message: 'User was found',
        result: [question.user],
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

router.get('/questions/:id(\\d+)/categories', (req, res, next) => {
  Question.findById(req.params.id, {
    include: [{ model: Category, through: { attributes: [] }, attributes: ['id', 'name'] }],
    attributes
  }).then((question) => {
    if (question.categories.length) {
      res.status(200).json({
        status: 200,
        message: 'Categories was found',
        result: question.categories,
        error: null
      });
    } else {
      let err = new Error('Categories was not found');
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

router.get('/questions/:id(\\d+)/tags', (req, res, next) => {
  Question.findById(req.params.id, {
    include: [{ model: Tag, through: { attributes: [] }, attributes: ['id', 'name'] }],
    attributes
  }).then((question) => {
    if (question.tags.length) {
      res.status(200).json({
        status: 200,
        message: 'Tags was found',
        result: question.tags,
        error: null
      });
    } else {
      let err = new Error('Tags was not found');
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

router.post('/questions', (req, res, next) => {
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Question.create(req.body).then(({ id, subject, question, views, user_id }) => {
    res.status(201).json({
      status: 201,
      message: 'New question was successfully created',
      result: [{ id, subject, question, views, user_id }],
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

router.put('/questions/:id(\\d+)', (req, res, next) => {
  Question.findById(req.params.id).then((question) => {
    if (question) {
      if (req.authPayload.id !== +question.user_id) {
        let err = new Error('Сan not update question of another user');
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
      return question.update(req.body).then(({ id, subject, question, views, user_id }) => {
        res.status(200).json({
          status: 200,
          message: 'Question was successfully updated',
          result: [{ id, subject, question, views, user_id }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Question was not found');
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

router.delete('/questions/:id(\\d+)', (req, res, next) => {
  Question.findById(req.params.id).then((question) => {
    if (question) {
      if (req.authPayload.id !== +question.user_id) {
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
      return question.destroy().then(({ id, subject, question, views, user_id }) => {
        res.status(200).json({
          status: 200,
          message: 'Question was successfully deleted',
          result: [{ id, subject, question, views, user_id }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Question was not found');
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
