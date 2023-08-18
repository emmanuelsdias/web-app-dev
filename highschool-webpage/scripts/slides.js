let currentSlide = 1;
showSlide(currentSlide);

function showSlide(n) {
  const slides = document.getElementsByClassName("slideshow-image");
  if (n > slides.length) { currentSlide = 1; }
  if (n < 1) { currentSlide = slides.length; }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[currentSlide - 1].style.display = "block";
}

var counter;
startCounter();

function startCounter() {
  clearInterval(counter);    
  counter = setInterval(function(){ changeSlide(+1); }, 5000);
}

function changeSlide(n) {
  showSlide(currentSlide += n);
  startCounter();
}

