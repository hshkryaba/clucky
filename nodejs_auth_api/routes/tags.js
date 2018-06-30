const config = require('../config');
const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');
const Tag = require('../models/tag.js')
const auth = require('../lib/jwt_auth.js');

const attributes = ['id', 'name'];

router.use(auth(config.jwt.access));

router.get('/tags', (req, res, next) => {
  Tag.findAll({
    attributes,
    offset: +(req.query.offset || 0),
    limit: +(req.query.limit || 100)
  }).then((tags) => {
    if (tags.length) {
      res.status(200).json({
        status: 200,
        message: 'Tags was found',
        result: tags,
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

router.get('/tags/:id(\\d+)', (req, res, next) => {
  Tag.findById(req.params.id, { attributes }).then((tag) => {
    if (tag) {
      res.status(200).json({
        status: 200,
        message: 'Tag was found',
        result: [tag],
        error: null
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

router.get('/tags/:id(\\d+)/questions', (req, res, next) => {
  Tag.findById(req.params.id, {
    include: [{ model: Question, through: { attributes: [] }, attributes: ['id', 'subject', 'question', 'user_id'] }],
    attributes
  }).then((tag) => {
    if (tag.questions.length) {
      res.status(200).json({
        status: 200,
        message: 'Qustions was found',
        result: tag.questions,
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

router.post('/tags', (req, res, next) => {
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Tag.create(req.body).then(({ id, name }) => {
    res.status(201).json({
      status: 201,
      message: 'New tag was successfully created',
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

router.post('/tags/:id(\\d+)/questions/:qid(\\d+)/set', (req, res, next) => {
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.addQuestion(req.params.qid).then((assign) => {
        res.status(200).json({
          status: 200,
          message: 'Tag was successfully assigned',
          result: assign,
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

router.post('/tags/:id(\\d+)/questions/:qid(\\d+)/del', (req, res, next) => {
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.removeQuestion(req.params.qid).then((assign) => {
        res.status(200).json({
          status: 200,
          message: 'Tag was successfully deleted',
          result: assign,
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

router.put('/tags/:id(\\d+)', (req, res, next) => {
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.update(req.body).then(({ id, name }) => {
        res.status(200).json({
          status: 200,
          message: 'Tag was successfully updated',
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

router.delete('/tags/:id(\\d+)', (req, res, next) => {
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.destroy().then(({ id, name }) => {
        res.status(200).json({
          status: 200,
          message: 'Tag was successfully deleted',
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

module.exports = router;
