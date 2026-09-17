/* ============================================================
   HERO SLIDER
   ============================================================ */

function initHeroSlider() {

  const slider = document.getElementById("heroSlider");

  if (!slider) return;


  const track = slider.querySelector(".hero-slider-track");

  const slides = Array.from(
    slider.querySelectorAll(".hero-slide")
  );

  const dots = slider.querySelectorAll(".slider-dot");

  const prevBtn =
    document.getElementById("slidePrev");

  const nextBtn =
    document.getElementById("slideNext");


  if (!track || slides.length === 0) return;


  let currentIndex = 0;

  let autoSlideTimer = null;

  const totalSlides = slides.length;


  /* ==========================================================
     MOVE SLIDER
     ========================================================== */

  function moveSlider() {

    const slide = slides[currentIndex];

    if (!slide) return;

    const slideWidth = slide.offsetWidth;

    const gap = 18;

    const moveAmount = slideWidth + gap;

    track.style.transform =
      `translateX(-${currentIndex * moveAmount}px)`;


    /* Active slide */

    slides.forEach(function (slide) {
      slide.classList.remove("is-active");
    });

    slides[currentIndex].classList.add("is-active");


    /* Active dot */

    dots.forEach(function (dot) {
      dot.classList.remove("is-active");
    });

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add("is-active");
    }
  }


  /* ==========================================================
     NEXT
     ========================================================== */

  function nextSlide() {

    currentIndex = (currentIndex + 1) % totalSlides;

    moveSlider();
  }


  /* ==========================================================
     PREVIOUS
     ========================================================== */

  function previousSlide() {

    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;

    moveSlider();
  }


  /* ==========================================================
     AUTO SLIDE
     ========================================================== */

  function startAutoSlide() {

    stopAutoSlide();

    autoSlideTimer = setInterval(
      nextSlide,
      4500
    );
  }


  function stopAutoSlide() {

    if (autoSlideTimer) {

      clearInterval(autoSlideTimer);

      autoSlideTimer = null;
    }
  }


  /* ==========================================================
     NEXT BUTTON
     ========================================================== */

  if (nextBtn) {

    nextBtn.addEventListener(
      "click",
      function () {

        nextSlide();

        startAutoSlide();
      }
    );
  }


  /* ==========================================================
     PREVIOUS BUTTON
     ========================================================== */

  if (prevBtn) {

    prevBtn.addEventListener(
      "click",
      function () {

        previousSlide();

        startAutoSlide();
      }
    );
  }


  /* ==========================================================
     DOTS
     ========================================================== */

  dots.forEach(function (dot, index) {

    dot.addEventListener(
      "click",
      function () {

        currentIndex = index;

        moveSlider();

        startAutoSlide();
      }
    );
  });


  /* ==========================================================
     PAUSE ON HOVER
     ========================================================== */

  slider.addEventListener(
    "mouseenter",
    stopAutoSlide
  );


  slider.addEventListener(
    "mouseleave",
    startAutoSlide
  );


  /* ==========================================================
     RESPONSIVE RESIZE
     ========================================================== */

  window.addEventListener(
    "resize",
    moveSlider
  );


  /* ==========================================================
     START
     ========================================================== */

  moveSlider();

  startAutoSlide();
}