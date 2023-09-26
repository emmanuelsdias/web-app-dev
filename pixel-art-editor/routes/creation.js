const express = require('express');
const router = express.Router();
const path = require('path');

// Route for displaying the creation page
router.get('/', (req, res) => {
  res.render('creation');
});

module.exports = router;
