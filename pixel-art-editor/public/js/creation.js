document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.querySelector('.board-container');
  const boardSizeSelector = document.getElementById('board-size');
  const clearBoardButton = document.getElementById('clear-board');
  const uploadButton = document.getElementById('upload-button');
  
  const termsMessage = document.getElementById('terms-label');
  const termsInput = document.getElementById('terms');
  
  const imageResult = document.getElementById('upload-image');
  
  let selectedSize = parseInt(boardSizeSelector.value);

  // Resize the board based on the selected size
  function resizeBoard(size) {
    const pixelSize = (boardContainer.offsetWidth - 2) / selectedSize;
    boardContainer.style.gridTemplateColumns = `repeat(${size}, ${pixelSize}px)`;
    boardContainer.style.gridTemplateRows = `repeat(${size}, ${pixelSize}px)`;
  }

  // Paint the pixel with the specified color
  function paintPixel(cell, color) {
    cell.style.backgroundColor = color;
  }

  // Create the board with the specified size
  function createBoard(size) {
    boardContainer.innerHTML = '';

    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel');
      pixel.addEventListener('mousedown', (e) => {
        paintPixel(pixel, '#000')
        e.preventDefault();
      });
      pixel.addEventListener('mouseover', (e) => {
        if (e.buttons == 1) {
          paintPixel(pixel, '#000');
        }
      });
      boardContainer.appendChild(pixel);
    }
    resizeBoard(size);
  }

  // Initialize the board with the default size
  createBoard(selectedSize);

  // On window resize, resize the board
  window.addEventListener('resize', () => {
    resizeBoard(selectedSize);
  }, false);

  // Button event to change board size
  boardSizeSelector.addEventListener('change', function () {
    selectedSize = parseInt(boardSizeSelector.value);
    createBoard(selectedSize);
  }, false);

  // Button event to clear board
  clearBoardButton.addEventListener('click', function () {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
      paintPixel(pixel, '#fff');
    });
  }, false);

  // Button event to upload image
  uploadButton.addEventListener('click', function () {

    // Compose the binary image according to board pixels
    let binaryImage = [];
    boardContainer.childNodes.forEach((pixel) => {
      if (pixel.style.backgroundColor === 'rgb(0, 0, 0)') {
        binaryImage.push(1);
      } else {
        binaryImage.push(0);
      }
    })

    // Send the image to the server using an AJAX request
    fetch('/creation/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        terms: termsInput.value,
        image: binaryImage
      }),
    }).then(response => {
      // Parse the JSON response to access the image's path
      if (response.ok) {
        response.json().then(data => {
          imageResult.src = "../" + data.imagePath;
          termsInput.value = "";
        });
        // If user didn't accept the terms, highlight terms message
      } else if (response.status == 499) {
        console.error('Did not accept the terms!');
        if (termsMessage.style.color !== "red") {
          termsMessage.style.color = "red";
        } else {
          termsMessage.style.fontWeight = "bold";
        }
      } else {
        console.error('Error creating the image!');
      }
    })
  }, false);
});
