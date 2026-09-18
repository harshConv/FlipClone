/* ============================================================
   HERO SLIDER - js/Advertise.js

   Features:
   - Infinite loop
   - Desktop side preview
   - Mobile full-width slides
   - Auto slide
   - Previous / Next buttons
   - Dots
   - Mouse drag + Touch swipe (unified pointer logic)
   - Keyboard arrow key navigation
   ============================================================ */

function initHeroSlider() {

  // ----------------------------------------------------------
  // 1. GET HTML ELEMENTS
  // ----------------------------------------------------------

  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const track = slider.querySelector(".hero-slider-track");
  let slides = Array.from(slider.querySelectorAll(".hero-slide:not(.is-clone)"));
  const dots = slider.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!track || slides.length === 0) return;

  // ----------------------------------------------------------
  // 2. SLIDER SETTINGS
  // ----------------------------------------------------------

  const totalSlides = slides.length;
  const cloneCount = 2;
  const AUTO_SLIDE_MS = 4500;
  const SWIPE_THRESHOLD = 40;

  let currentIndex = cloneCount;
  let autoSlideTimer = null;

  // ----------------------------------------------------------
  // 3. BUILD CLONES (left + right in one pass)
  // ----------------------------------------------------------

  track.querySelectorAll(".is-clone").forEach(clone => clone.remove());

  const leftClones = slides
    .slice(totalSlides - cloneCount)
    .map(slide => makeClone(slide));

  const rightClones = slides
    .slice(0, cloneCount)
    .map(slide => makeClone(slide));

  leftClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
  rightClones.forEach(clone => track.appendChild(clone));

  function makeClone(slide) {
    const clone = slide.cloneNode(true);
    clone.classList.add("is-clone");
    clone.classList.remove("is-active");
    return clone;
  }

  // Get all slides including clones
  slides = Array.from(track.querySelectorAll(".hero-slide"));

  // ----------------------------------------------------------
  // 4. DRAG / SWIPE STATE
  // ----------------------------------------------------------

  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let previousTranslate = 0;
  let animationFrame;

  // ----------------------------------------------------------
  // 5. POSITION HELPERS
  // ----------------------------------------------------------

  function getSlidePosition(index) {
    const isMobile = window.innerWidth <= 768;
    const sliderWidth = slider.clientWidth;

    if (isMobile) {
      return -index * sliderWidth;
    }

    const slide = slides[index];
    const slideWidth = slide ? slide.offsetWidth : sliderWidth * 0.54;
    const gap = 16;
    const centerOffset = (sliderWidth - slideWidth) / 2;

    return -(index * (slideWidth + gap)) + centerOffset;
  }

  function getRealIndex(index) {
    return ((index - cloneCount) % totalSlides + totalSlides) % totalSlides;
  }

  // ----------------------------------------------------------
  // 6. UPDATE ACTIVE SLIDE + DOT
  // ----------------------------------------------------------

  function updateActiveSlide() {
    const realIndex = getRealIndex(currentIndex);

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === realIndex);
    });
  }

  // ----------------------------------------------------------
  // 7. MOVE SLIDER
  // ----------------------------------------------------------

  function moveSlider(animate = true) {
    currentTranslate = getSlidePosition(currentIndex);
    previousTranslate = currentTranslate;

    track.style.transition = animate
      ? "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)"
      : "none";

    track.style.transform = `translateX(${currentTranslate}px)`;
    updateActiveSlide();
  }

  // ----------------------------------------------------------
  // 8. FIX INFINITE LOOP (single boundary check)
  // ----------------------------------------------------------

  track.addEventListener("transitionend", () => {
    if (isDragging) return;

    if (currentIndex >= totalSlides + cloneCount) {
      currentIndex -= totalSlides;
      moveSlider(false);
    } else if (currentIndex < cloneCount) {
      currentIndex += totalSlides;
      moveSlider(false);
    }
  });

  // ----------------------------------------------------------
  // 9. NAVIGATION
  // ----------------------------------------------------------

  function goTo(delta) {
    currentIndex += delta;
    moveSlider(true);
    startAutoSlide();
  }

  function nextSlide() { goTo(1); }
  function previousSlide() { goTo(-1); }

  // ----------------------------------------------------------
  // 10. AUTOPLAY
  // ----------------------------------------------------------

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      currentIndex++;
      moveSlider(true);
    }, AUTO_SLIDE_MS);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }

  // ----------------------------------------------------------
  // 11. BUTTONS + DOTS
  // ----------------------------------------------------------

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", previousSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index + cloneCount;
      moveSlider(true);
      startAutoSlide();
    });
  });

  // ----------------------------------------------------------
  // 12. KEYBOARD ARROW KEYS
  // ----------------------------------------------------------

  // Make the slider focusable so it can receive key events,
  // and only respond to arrow keys when the slider (or a child) has focus.
  if (!slider.hasAttribute("tabindex")) {
    slider.setAttribute("tabindex", "0");
  }

  slider.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousSlide();
    }
  });

  // ----------------------------------------------------------
  // 13. PAUSE ON HOVER
  // ----------------------------------------------------------

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  // ----------------------------------------------------------
  // 14. UNIFIED DRAG / SWIPE (mouse + touch)
  // ----------------------------------------------------------

  function getPositionX(event) {
    return event.type.includes("mouse") ? event.clientX : event.touches[0].clientX;
  }

  function dragStart(event) {
    isDragging = true;
    startX = getPositionX(event);
    stopAutoSlide();
    track.style.transition = "none";
    animationFrame = requestAnimationFrame(dragAnimation);
  }

  function dragMove(event) {
    if (!isDragging) return;
    const distance = getPositionX(event) - startX;
    currentTranslate = previousTranslate + distance;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationFrame);

    const distance = currentTranslate - previousTranslate;

    if (distance < -SWIPE_THRESHOLD) currentIndex++;
    else if (distance > SWIPE_THRESHOLD) currentIndex--;

    moveSlider(true);
    startAutoSlide();
  }

  function dragAnimation() {
    if (!isDragging) return;
    track.style.transform = `translateX(${currentTranslate}px)`;
    animationFrame = requestAnimationFrame(dragAnimation);
  }

  // Touch events
  track.addEventListener("touchstart", dragStart, { passive: true });
  track.addEventListener("touchmove", dragMove, { passive: true });
  track.addEventListener("touchend", dragEnd);

  // Mouse events
  track.addEventListener("mousedown", dragStart);
  track.addEventListener("mousemove", dragMove);
  track.addEventListener("mouseup", dragEnd);
  track.addEventListener("mouseleave", () => { if (isDragging) dragEnd(); });

  // ----------------------------------------------------------
  // 15. PREVENT IMAGE DRAGGING
  // ----------------------------------------------------------

  slides.forEach(slide => {
    slide.addEventListener("dragstart", event => event.preventDefault());
  });

  // ----------------------------------------------------------
  // 16. HANDLE WINDOW RESIZE
  // ----------------------------------------------------------

  window.addEventListener("resize", () => moveSlider(false));

  // ----------------------------------------------------------
  // 17. INITIAL SLIDE + START
  // ----------------------------------------------------------

  moveSlider(false);
  startAutoSlide();
}