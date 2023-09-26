const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Directory where uploaded PNG images are stored
const uploadDir = path.join(__dirname, '../uploads');

// Route for displaying the gallery page
router.get('/', (req, res) => {
  // Read the contents of the upload directory
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading upload directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Filter the list to include only PNG files
    const pngFiles = files.filter((file) => path.extname(file).toLowerCase() === '.png');

    // Pass the list of PNG files to the gallery page
    res.render('gallery', { pngFiles });
  });
});

module.exports = router;
