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
  res.header('Access-Control-Allow-Credentials', 'true');
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
  res.status(406).json({ message: 'Cluck API' });
});

router.all('/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = router;
