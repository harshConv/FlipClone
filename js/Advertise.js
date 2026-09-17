/* ============================================================
   HERO SLIDER SCRIPT (js/Advertise.js)
   Features:
     • True Continuous Loop (Ring / Giant Wheel effect)
     • Cloned side buffer slides (no empty white space ever!)
     • Instant seamless snap transition on boundaries
     • Desktop side-previews & Mobile 100% full-width view
     • Touch swipe on mobile & touch screens
     • Mouse drag on desktop
     • Next / Prev arrow controls & Dot pagination
   ============================================================ */

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const track = slider.querySelector(".hero-slider-track");
  let originalSlides = Array.from(slider.querySelectorAll(".hero-slide:not(.is-clone)"));
  const dots = slider.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!track || originalSlides.length === 0) return;

  const N = originalSlides.length;
  const CLONE_COUNT = 2; // 2 clones on left, 2 clones on right

  // Clean up any existing clones if re-initialized
  track.querySelectorAll(".hero-slide.is-clone").forEach(c => c.remove());
  originalSlides = Array.from(track.querySelectorAll(".hero-slide"));

  // Clone last 2 slides to PREPEND (left buffer)
  for (let i = N - 1; i >= N - CLONE_COUNT; i--) {
    const clone = originalSlides[i].cloneNode(true);
    clone.classList.add("is-clone");
    clone.classList.remove("is-active");
    track.insertBefore(clone, track.firstChild);
  }

  // Clone first 2 slides to APPEND (right buffer)
  for (let i = 0; i < CLONE_COUNT; i++) {
    const clone = originalSlides[i].cloneNode(true);
    clone.classList.add("is-clone");
    clone.classList.remove("is-active");
    track.appendChild(clone);
  }

  const allSlides = Array.from(track.querySelectorAll(".hero-slide"));
  let domIndex = CLONE_COUNT; // Starts at Real Slide 0 (DOM Index 2)
  let autoSlideTimer = null;

  /* Touch / Drag state */
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  /* ==========================================================
     CALCULATE TRANSLATION POSITION FOR ANY DOM INDEX
     ========================================================== */

  function getTranslateForDomIndex(idx) {
    const isMobile = window.innerWidth <= 768;
    const sliderWidth = slider.clientWidth;

    if (isMobile) {
      return -idx * sliderWidth;
    } else {
      const slide = allSlides[idx] || allSlides[0];
      const slideWidth = slide ? slide.offsetWidth : sliderWidth * 0.54;
      const gap = 16;
      const centerOffset = (sliderWidth - slideWidth) / 2;
      return -(idx * (slideWidth + gap)) + centerOffset;
    }
  }

  function getRealIndex(dIdx) {
    let r = (dIdx - CLONE_COUNT) % N;
    if (r < 0) r += N;
    return r;
  }

  /* ==========================================================
     MOVE SLIDER
     ========================================================== */

  function moveSlider(animate = true) {
    currentTranslate = getTranslateForDomIndex(domIndex);
    prevTranslate = currentTranslate;

    if (animate) {
      track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(${currentTranslate}px)`;

    updateActiveClasses();
  }

  function updateActiveClasses() {
    const activeRealIdx = getRealIndex(domIndex);

    // Update slides active state
    allSlides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === domIndex);
    });

    // Update dots active state using real index
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === activeRealIdx);
    });
  }

  /* ==========================================================
     SEAMLESS SNAP ON BOUNDARIES (transitionend)
     ========================================================== */

  track.addEventListener("transitionend", function () {
    if (isDragging) return;

    // If reached right clones (past real slides)
    if (domIndex >= N + CLONE_COUNT) {
      domIndex = domIndex - N; // Snap back to equivalent real slide
      moveSlider(false); // Snap instantly with transition: none!
    }
    // If reached left clones (before real slide 0)
    else if (domIndex < CLONE_COUNT) {
      domIndex = domIndex + N; // Snap forward to equivalent real slide
      moveSlider(false); // Snap instantly with transition: none!
    }
  });

  /* ==========================================================
     SLIDE NAVIGATION
     ========================================================== */

  function nextSlide() {
    domIndex++;
    moveSlider(true);
  }

  function previousSlide() {
    domIndex--;
    moveSlider(true);
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
      domIndex = index + CLONE_COUNT;
      moveSlider(true);
      startAutoSlide();
    });
  });

  /* Hover pause */
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  /* Window resize handler */
  window.addEventListener("resize", function () {
    moveSlider(false);
  });

  /* ==========================================================
     TOUCH & MOUSE DRAG DRIVER
     ========================================================== */

  function getPositionX(event) {
    return event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
  }

  function touchStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    stopAutoSlide();
    track.style.transition = "none";
    animationID = requestAnimationFrame(animation);
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

    if (movedBy < -40) {
      domIndex++;
    } else if (movedBy > 40) {
      domIndex--;
    }

    moveSlider(true);
    startAutoSlide();
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  /* Attach Touch & Mouse events to track */
  track.addEventListener("touchstart", touchStart, { passive: true });
  track.addEventListener("touchmove", touchMove, { passive: true });
  track.addEventListener("touchend", touchEnd);

  track.addEventListener("mousedown", touchStart);
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", function () {
    if (isDragging) touchEnd();
  });

  allSlides.forEach(slide => {
    slide.addEventListener("dragstart", e => e.preventDefault());
  });

  /* Initial position */
  moveSlider(false);
  startAutoSlide();
}