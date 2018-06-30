const config = require('../config');
const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');
const Category = require('../models/category.js')
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'name'];

router.use(auth(config.jwt.access));

router.get('/categories', (req, res, next) => {
  Category.findAll({
    attributes,
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((categories) => {
    if (categories.length) {
      res.status(200).json({
        status: 200,
        message: 'Categories was found',
        result: categories,
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

router.get('/categories/:id(\\d+)', (req, res, next) => {
  Category.findById(req.params.id, { attributes }).then((category) => {
    if (category) {
      res.status(200).json({
        status: 200,
        message: 'Category was found',
        result: [category],
        error: null
      });
    } else {
      let err = new Error('Category was not found');
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

router.get('/categories/:id(\\d+)/questions', (req, res, next) => {
  Category.findById(req.params.id, {
    include: [{ model: Question, through: { attributes: [] }, attributes: ['id', 'subject', 'question', 'user_id'] }],
    attributes
  }).then((category) => {
    if (category.questions.length) {
      res.status(200).json({
        status: 200,
        message: 'Qustions was found',
        result: category.questions,
        error: null
      });
    } else {
      let err = new Error('Qustions was not found');
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

router.post('/categories', (req, res, next) => {
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Category.create(req.body).then(({ id, name }) => {
    res.status(201).json({
      status: 201,
      message: 'New category was successfully created',
      result: [{ id, name }],
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

router.post('/categories/:id(\\d+)/questions/:qid(\\d+)/set', (req, res, next) => {
  Category.findById(req.params.id).then((category) => {
    if (category) {
      return category.addQuestion(req.params.qid).then((assign) => {
        res.status(200).json({
          status: 200,
          message: 'Category was successfully assigned',
          result: assign,
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Category was not found');
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

router.post('/categories/:id(\\d+)/questions/:qid(\\d+)/del', (req, res, next) => {
  Category.findById(req.params.id).then((category) => {
    if (category) {
      return category.removeQuestion(req.params.qid).then((assign) => {
        res.status(200).json({
          status: 200,
          message: 'Category was successfully deleted',
          result: assign,
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Category was not found');
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

router.put('/categories/:id(\\d+)', (req, res, next) => {
  Category.findById(req.params.id).then((category) => {
    if (category) {
      return category.update(req.body).then(({ id, name }) => {
        res.status(200).json({
          status: 200,
          message: 'Category was successfully updated',
          result: [{ id, name }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Tag was not found');
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

router.delete('/categories/:id(\\d+)', (req, res, next) => {
  Category.findById(req.params.id).then((category) => {
    if (category) {
      return category.destroy().then(({ id, name }) => {
        res.status(200).json({
          status: 200,
          message: 'Category was successfully deleted',
          result: [{ id, name }],
          error: null
        });
      }).catch((err) => {
        throw err;
      });
    } else {
      let err = new Error('Category was not found');
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
