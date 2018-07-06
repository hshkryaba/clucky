const config = require('../config');
const express = require('express');
const router = express.Router();
const Question = require('../models/question.js');
const Tag = require('../models/tag.js');
const auth = require('../lib/jwt_auth.js');
const getFormattedSender = require('../lib/formatted_sender.js');

const attributes = ['id', 'name'];

router.use(auth(config.jwt.access));

router.get('/tags', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findAll({
    attributes,
    offset: +req.query.offset || 0,
    limit: +req.query.limit || 100
  }).then((tags) => {
    if (tags.length) {
      formattedSend(
        200,
        tags,
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

router.get('/tags/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id, { attributes })
    .then((tag) => {
      if (tag) {
        formattedSend(
          200,
          tag,
          'Tag was found',
          false
        );
      } else {
        let err = new Error('Tag was not found');
        formattedSend(404, err);
      }
    }).catch((err) => {
      formattedSend(500, err);
    });
});

router.get('/tags/:id(\\d+)/questions', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id, {
    include: [{
      model: Question,
      through: { attributes: [] },
      attributes: ['id', 'subject', 'question', 'user_id']
    }],
    attributes
  }).then((tag) => {
    if (tag.questions.length) {
      formattedSend(
        200,
        tag.questions,
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

router.post('/tags', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  req.body.user_id = req.body.user_id || req.authPayload.id;
  Tag.create(req.body).then(({ id, name }) => {
    formattedSend(
      201,
      { id, name },
      'Tag was successfully created',
      false
    );
  }).catch((err) => {
    formattedSend(500, err);
  });
});

router.post('/tags/:id(\\d+)/questions/:qid(\\d+)/set', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.addQuestion(req.params.qid)
        .then((assign) => {
          formattedSend(
            200,
            assign,
            'Tag was successfully assigned',
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

router.post('/tags/:id(\\d+)/questions/:qid(\\d+)/del', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.removeQuestion(req.params.qid)
        .then((assign) => {
          formattedSend(
            200,
            assign,
            'Tag was successfully deleted',
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

router.put('/tags/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.update(req.body)
        .then(({ id, name }) => {
          formattedSend(
            200,
            { id, name },
            'Tag was successfully updated',
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

router.delete('/tags/:id(\\d+)', (req, res, next) => {
  const formattedSend = getFormattedSender(res);
  Tag.findById(req.params.id).then((tag) => {
    if (tag) {
      return tag.destroy().then(({ id, name }) => {
        formattedSend(
          200,
          { id, name },
          'Tag was successfully deleted',
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

module.exports = router;
