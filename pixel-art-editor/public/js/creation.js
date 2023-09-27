document.addEventListener('DOMContentLoaded', () => {
  let selectedSize = 16;

  const boardSizeSelect = document.getElementById('board-size');
  const boardContainer = document.querySelector('.board-container');
  const clearBoardButton = document.getElementById('clear-board');
  const uploadButton = document.getElementById('upload-button');

  // Função para criar o grid com base no tamanho selecionado
  function resizeBoard(size) {
    const pixelSize = (boardContainer.offsetWidth - 2) / selectedSize;
    boardContainer.style.gridTemplateColumns = `repeat(${size}, ${pixelSize}px)`;
    boardContainer.style.gridTemplateRows = `repeat(${size}, ${pixelSize}px)`;
  }

  window.addEventListener('resize', () => {
    resizeBoard(selectedSize);
  });

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

  function paintPixel(cell, color) {
    cell.style.backgroundColor = color;
  }

  // Inicializa o grid com o tamanho padrão (16x16)
  createBoard(selectedSize);

  // Button event to change board size
  boardSizeSelect.addEventListener('change', function () {
    selectedSize = parseInt(boardSizeSelect.value);
    createBoard(selectedSize);
  });

  // Button event to clear board
  clearBoardButton.addEventListener('click', function () {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => {
      pixel.style.backgroundColor = '#fff';
    });
  });

  // Button event to upload image
  uploadButton.addEventListener('click', function () {
    let binaryImage = [];
    
    boardContainer.childNodes.forEach((pixel) => {
      if (pixel.style.backgroundColor !== '') {
        binaryImage.push(1);
      } else {
        binaryImage.push(0);
      }
    })
    // Send the image to the server using an AJAX request
    fetch('/creation/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ binaryImage }),
    }).then(response => {
      if (response.ok) {
        // Parse the JSON response to access the imagePath
        response.json().then(data => {
          const imageResult = document.getElementById('upload-image');
          imageResult.src = "../" + data.imagePath;
        });
      } else {
        console.error('Error generating PNG image');
      }
    });
  });
});
