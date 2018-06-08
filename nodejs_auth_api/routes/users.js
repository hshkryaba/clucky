const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/users', (req, res, next) => {
  res.json({ message: 'user api under development' });
});

module.exports = router;
