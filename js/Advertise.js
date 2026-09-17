/* ============================================================
   ADVERTISE / HERO SLIDER SCRIPT
   ============================================================ */

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");

  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dots = slider.querySelectorAll(".slider-dot");

  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  /* ----------------------------------------------------------
     Show selected slide
     ---------------------------------------------------------- */

  function goToSlide(index) {

    // Remove active class from current slide
    slides[currentIndex].classList.remove("is-active");

    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove("is-active");
    }

    // Calculate next index
    currentIndex =
      (index + slides.length) % slides.length;

    // Show new slide
    slides[currentIndex].classList.add("is-active");

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("is-active");
    }
  }

  /* ----------------------------------------------------------
     Next slide
     ---------------------------------------------------------- */

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /* ----------------------------------------------------------
     Previous slide
     ---------------------------------------------------------- */

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /* ----------------------------------------------------------
     Automatic sliding
     ---------------------------------------------------------- */

  function startAutoSlide() {

    stopAutoSlide();

    autoSlideTimer = setInterval(function () {
      nextSlide();
    }, 4500);
  }

  function stopAutoSlide() {

    if (autoSlideTimer !== null) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  /* ----------------------------------------------------------
     Next button
     ---------------------------------------------------------- */

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {

      nextSlide();

      startAutoSlide();
    });
  }

  /* ----------------------------------------------------------
     Previous button
     ---------------------------------------------------------- */

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {

      prevSlide();

      startAutoSlide();
    });
  }

  /* ----------------------------------------------------------
     Dots
     ---------------------------------------------------------- */

  dots.forEach(function (dot, index) {

    dot.addEventListener("click", function () {

      goToSlide(index);

      startAutoSlide();
    });

  });

  /* ----------------------------------------------------------
     Pause when mouse is over slider
     ---------------------------------------------------------- */

  slider.addEventListener("mouseenter", function () {
    stopAutoSlide();
  });

  slider.addEventListener("mouseleave", function () {
    startAutoSlide();
  });

  /* Start slider */
  startAutoSlide();
}/* ============================================================
   ADVERTISE / HERO SLIDER SCRIPT
   ============================================================ */

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");

  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dots = slider.querySelectorAll(".slider-dot");

  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  /* ----------------------------------------------------------
     Show selected slide
     ---------------------------------------------------------- */

  function goToSlide(index) {

    // Remove active class from current slide
    slides[currentIndex].classList.remove("is-active");

    if (dots[currentIndex]) {
      dots[currentIndex].classList.remove("is-active");
    }

    // Calculate next index
    currentIndex =
      (index + slides.length) % slides.length;

    // Show new slide
    slides[currentIndex].classList.add("is-active");

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("is-active");
    }
  }

  /* ----------------------------------------------------------
     Next slide
     ---------------------------------------------------------- */

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /* ----------------------------------------------------------
     Previous slide
     ---------------------------------------------------------- */

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /* ----------------------------------------------------------
     Automatic sliding
     ---------------------------------------------------------- */

  function startAutoSlide() {

    stopAutoSlide();

    autoSlideTimer = setInterval(function () {
      nextSlide();
    }, 4500);
  }

  function stopAutoSlide() {

    if (autoSlideTimer !== null) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  /* ----------------------------------------------------------
     Next button
     ---------------------------------------------------------- */

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {

      nextSlide();

      startAutoSlide();
    });
  }

  /* ----------------------------------------------------------
     Previous button
     ---------------------------------------------------------- */

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {

      prevSlide();

      startAutoSlide();
    });
  }

  /* ----------------------------------------------------------
     Dots
     ---------------------------------------------------------- */

  dots.forEach(function (dot, index) {

    dot.addEventListener("click", function () {

      goToSlide(index);

      startAutoSlide();
    });

  });

  /* ----------------------------------------------------------
     Pause when mouse is over slider
     ---------------------------------------------------------- */

  slider.addEventListener("mouseenter", function () {
    stopAutoSlide();
  });

  slider.addEventListener("mouseleave", function () {
    startAutoSlide();
  });

  /* Start slider */
  startAutoSlide();
}