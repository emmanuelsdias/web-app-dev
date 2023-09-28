const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');
const PNG = require('pngjs').PNG;

const MAX_FILES = 20;
const NUM_EXAMPLES = 4;

// Route for displaying the creation page
router.get('/', (req, res) => {
  res.render('creation');
});

// Route for uploading the drawings
router.post('/upload', (req, res) => {
  const terms = req.body.terms;
  const list = req.body.image;

  // Check if the user agreed to the terms and conditions
  if (terms !== 'Yes') {
    return res.status(499).send('You must agree to the terms and conditions!');
  }

  // Calculate the width of the image based on the length of the list
  const size = Math.sqrt(list.length);
  if (size !== 16 && size !== 32 && size !== 64) {
    return res.status(400).send('Invalid image size!');
  }

  // Create a PNG image with the specified size
  let png = new PNG({ 
    width: size,
    height: size,
    colorType: 0,
   });

  // Loop through the list and set pixel colors
  let idx = 0;
  list.forEach(element => {
    if (element === 1) {
      png.data[4 * idx] = 0x00;
      png.data[4 * idx + 1] = 0x00;
      png.data[4 * idx + 2] = 0x00;
      png.data[4 * idx + 3] = 0xFF;
    } else if (element === 0) {
      png.data[4 * idx] = 0xFF;
      png.data[4 * idx + 1] = 0xFF;
      png.data[4 * idx + 2] = 0xFF;
      png.data[4 * idx + 3] = 0xFF;
    } else {
      return res.status(400).send('Invalid image input!');
    }
    idx += 1;
  });

  // Count the number of existing files in uploads directory
  const directory = 'uploads/';
  const files = fs.readdirSync(directory);
  let numFiles = files.length - NUM_EXAMPLES;

  // If max files reached, remove the oldest file, sorry!
  if (numFiles >= MAX_FILES) {
    const oldestFile = files[4];
    fs.unlinkSync(path.join(directory, oldestFile));
  }

  // Save the PNG image to a file
  const imagePath = 'uploads/generated-' + Date.now() + '.png';
  const imageStream = fs.createWriteStream(imagePath);
  png.pack().pipe(imageStream);

  // Respond with status and image path
  res.json({ status: 'OK', imagePath });
});

module.exports = router;
