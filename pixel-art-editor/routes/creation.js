const express = require('express');
const router = express.Router();
const path = require('path');

const fs = require('fs');
const PNG = require('pngjs').PNG;

// Route for displaying the creation page
router.get('/', (req, res) => {
  res.render('creation');
});

router.post('/generate-image', (req, res) => {
  const list = req.body.binaryImage;

  // Calculate the width of the image based on the length of the list
  const size = Math.sqrt(list.length);
  if (size !== 16 && size !== 32 && size !== 64) {
    return res.status(400).send('Invalid image size');
  }

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

  // Save the PNG image to a file (or you can use a buffer if you don't need to save it)
  const imagePath = 'uploads/generated.png';
  const imageStream = fs.createWriteStream(imagePath);
  png.pack().pipe(imageStream);

  // Send a JSON response with the status and image path
  res.json({ status: 'OK', imagePath });
});


module.exports = router;
