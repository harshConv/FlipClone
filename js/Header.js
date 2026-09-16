/* ============================================================
   HEADER SCRIPT (js/Header.js)
   Interactions for components/Header.html
   ============================================================ */

function initHeader() {
  /* Category Rail Active Selector */
  const catRail = document.getElementById("catRail");
  if (catRail) {
    catRail.addEventListener("click", function (event) {
      const category = event.target.closest(".cat");
      if (!category) return;
      event.preventDefault();

      const currentActive = catRail.querySelector(".cat.is-active");
      if (currentActive) {
        currentActive.classList.remove("is-active");
      }
      category.classList.add("is-active");
    });
  }

  /* Smooth Scrolled Header Transition */
  const siteHeader = document.getElementById("siteHeader");
  let ticking = false;

  function onScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 60) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();

  /* Login Dropdown Toggle & Accessibility */
  const loginBtn = document.getElementById("loginBtn");
  const loginDropdown = document.getElementById("loginDropdown");
  const loginWrap = document.getElementById("loginWrap");

  if (loginBtn && loginDropdown) {
    loginBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = loginDropdown.classList.toggle("is-open");
      loginBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (loginWrap && !loginWrap.contains(event.target)) {
        loginDropdown.classList.remove("is-open");
        loginBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && loginDropdown.classList.contains("is-open")) {
        loginDropdown.classList.remove("is-open");
        loginBtn.setAttribute("aria-expanded", "false");
        loginBtn.focus();
      }
    });
  }

  /* Search Form Prevent Default */
  const searchForm = document.querySelector(".search");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = document.getElementById("siteSearch");
      if (input && input.value.trim()) {
        console.log("Searching for:", input.value.trim());
      }
    });
  }
}
