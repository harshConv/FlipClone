/* ============================================================
   ADVERTISE / HERO SLIDER SCRIPT (js/Advertise.js)
   Interactions for components/Advertise.html
   ============================================================ */

function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".hero-slide");
  const dots = slider.querySelectorAll(".slider-dot");
  const prevBtn = document.getElementById("slidePrev");
  const nextBtn = document.getElementById("slideNext");

  if (!slides.length) return;

  let currentIndex = 0;
  let autoSlideTimer = null;

  function goToSlide(index) {
    slides[currentIndex].classList.remove("is-active");
    if (dots[currentIndex]) dots[currentIndex].classList.remove("is-active");

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add("is-active");
    if (dots[currentIndex]) dots[currentIndex].classList.add("is-active");
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
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

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", function () {
      goToSlide(idx);
      startAutoSlide();
    });
  });

  // Pause on hover
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  startAutoSlide();
}
