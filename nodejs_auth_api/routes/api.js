const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const authRouter = require('./auth');

router.use('/api', authRouter);
router.use('/api', usersRouter);

router.get('/api/*', (req, res, next) => {
  res.status(403).json({ message: 'Cluck API' });
});

router.all('/*', (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = router;
