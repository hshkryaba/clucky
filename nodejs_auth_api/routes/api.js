const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const usersRouter = require('./users');
const questionsRouter = require('./questions');
const answersRouter = require('./answers');
const categoriesRouter = require('./categories');
const tagsRouter = require('./tags');
const votesRouter = require('./votes');

router.use('/api/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, HEAD, OPTIONS, GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-access-token, User-Agent');
  next();
});

router.use('/api', authRouter);
router.use('/api', usersRouter);
router.use('/api', questionsRouter);
router.use('/api', answersRouter);
router.use('/api', categoriesRouter);
router.use('/api', tagsRouter);
router.use('/api', votesRouter);

router.all('/api/*', (req, res, next) => {
  res.status(406).json({ message: 'Cluck API, undefined route' });
});

router.all('/*', (req, res, next) => {
  res.sendStatus(404);
});

module.exports = router;
