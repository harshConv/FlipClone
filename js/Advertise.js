/* ============================================================
   HERO SLIDER SCRIPT (js/Advertise.js)
   Supports:
     • Desktop: Centered active slide with left/right previews
     • Mobile: 100% full-width single slide view
     • Auto-play slider with hover pause & drag reset
     • Touch swipe on mobile & touch screens
     • Mouse drag on desktop
     • Next / Prev arrow controls & Dot pagination
   ============================================================ */

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const track = slider.querySelector(".hero-slider-track");
  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = slider.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  const totalSlides = slides.length;

  /* Touch / Drag state */
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  /* ==========================================================
     CALCULATE TRANSLATION POSITION
     ========================================================== */

  function calculateTargetTranslate(index) {
    const isMobile = window.innerWidth <= 768;
    const sliderWidth = slider.clientWidth;

    if (isMobile) {
      return -index * sliderWidth;
    } else {
      const slide = slides[0];
      const slideWidth = slide ? slide.offsetWidth : sliderWidth * 0.54;
      const gap = 16; // gap between slides on desktop
      const centerOffset = (sliderWidth - slideWidth) / 2;
      return -(index * (slideWidth + gap)) + centerOffset;
    }
  }

  /* ==========================================================
     MOVE SLIDER
     ========================================================== */

  function moveSlider() {
    currentTranslate = calculateTargetTranslate(currentIndex);
    prevTranslate = currentTranslate;

    track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateX(${currentTranslate}px)`;

    /* Update active class on slides */
    slides.forEach(function (slide, idx) {
      if (idx === currentIndex) {
        slide.classList.add("is-active");
      } else {
        slide.classList.remove("is-active");
      }
    });

    /* Update active class on dots */
    dots.forEach(function (dot, idx) {
      if (idx === currentIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
  }

  /* ==========================================================
     SLIDE NAVIGATION
     ========================================================== */

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    moveSlider();
  }

  function previousSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    moveSlider();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(nextSlide, 4500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  /* ==========================================================
     EVENT LISTENERS - ARROWS & DOTS
     ========================================================== */

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      previousSlide();
      startAutoSlide();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      currentIndex = index;
      moveSlider();
      startAutoSlide();
    });
  });

  /* Hover pause */
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  /* Resize listener */
  window.addEventListener("resize", function () {
    moveSlider();
  });

  /* ==========================================================
     TOUCH & MOUSE DRAG DRIVER
     ========================================================== */

  function getPositionX(event) {
    return event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
  }

  function touchStart(index) {
    return function (event) {
      isDragging = true;
      startX = getPositionX(event);
      stopAutoSlide();
      track.style.transition = "none"; // Fast responsive drag
      animationID = requestAnimationFrame(animation);
    };
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startX;
    currentTranslate = prevTranslate + diff;
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    // Threshold for slide change: 40px
    if (movedBy < -40 && currentIndex < totalSlides - 1) {
      currentIndex += 1;
    } else if (movedBy > 40 && currentIndex > 0) {
      currentIndex -= 1;
    }

    moveSlider();
    startAutoSlide();
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  /* Attach Touch events to track */
  track.addEventListener("touchstart", touchStart(currentIndex), { passive: true });
  track.addEventListener("touchmove", touchMove, { passive: true });
  track.addEventListener("touchend", touchEnd);

  /* Attach Mouse Drag events to track */
  track.addEventListener("mousedown", touchStart(currentIndex));
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", function () {
    if (isDragging) touchEnd();
  });

  /* Prevent drag image ghosting */
  slides.forEach(slide => {
    slide.addEventListener("dragstart", e => e.preventDefault());
  });

  /* Initialize */
  moveSlider();
  startAutoSlide();
}