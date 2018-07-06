const config = require('../config');
const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');
const Category = require('../models/category.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'name'];

router.use(auth(config.jwt.access));

router.get('/categories', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findAll({
    attributes,
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((categories) => {
    if (categories.length) {
      formattedSend(
        200,
        categories,
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

router.get('/categories/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id, { attributes })
    .then((category) => {
      if (category) {
        formattedSend(
          200,
          category,
          'Category was found',
          false
        );
      } else {
        let err = new Error('Category was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.get('/categories/:id(\\d+)/questions', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id, {
    include: [{
      model: Question,
      through: { attributes: [] },
      attributes: ['id', 'subject', 'question', 'user_id']
    }],
    attributes
  }).then((category) => {
    if (category.questions.length) {
      formattedSend(
        200,
        category.questions,
        'Qustions was found',
        false
      );
    } else {
      let err = new Error('Qustions was not found');
      formattedSend(404, err);
    }
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/categories', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Category.create(req.body)
    .then(({ id, name }) => {
      formattedSend(
        201,
        { id, name },
        'New category was successfully created',
        false
      );
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.post('/categories/:id(\\d+)/questions/:qid(\\d+)/set', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return category.addQuestion(req.params.qid)
          .then((assign) => {
            formattedSend(
              200,
              assign,
              'Category was successfully assigned',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Category was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.post('/categories/:id(\\d+)/questions/:qid(\\d+)/del', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return category.removeQuestion(req.params.qid)
          .then((assign) => {
            formattedSend(
              200,
              assign,
              'Category was successfully deleted',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Category was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.put('/categories/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return category.update(req.body)
          .then(({ id, name }) => {
            formattedSend(
              200,
              { id, name },
              'Category was successfully updated',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Tag was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.delete('/categories/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Category.findById(req.params.id)
    .then((category) => {
      if (category) {
        return category.destroy()
          .then(({ id, name }) => {
            formattedSend(
              200,
              { id, name },
              'Category was successfully deleted',
              false
            );
          }).catch((err) => {
            throw err;
          });
      } else {
        let err = new Error('Category was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

module.exports = router;
