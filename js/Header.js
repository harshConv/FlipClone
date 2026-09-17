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

  /* ── HAMBURGER MENU ─────────────────────────────────────── */
  initHamburger();
}


/* ============================================================
   HAMBURGER / MOBILE DRAWER
   ============================================================ */

function initHamburger() {
  const hamburgerBtn   = document.getElementById("hamburgerBtn");
  const mobileDrawer   = document.getElementById("mobileDrawer");
  const drawerOverlay  = document.getElementById("drawerOverlay");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");

  if (!hamburgerBtn || !mobileDrawer) return;

  /* ── Open / Close helpers ── */
  function openDrawer() {
    mobileDrawer.classList.add("is-open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    hamburgerBtn.classList.add("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    if (drawerOverlay) {
      drawerOverlay.classList.add("is-open");
      drawerOverlay.setAttribute("aria-hidden", "false");
    }
    document.body.classList.add("drawer-open");
    setTimeout(function () { if (drawerCloseBtn) drawerCloseBtn.focus(); }, 50);
  }

  function closeDrawer() {
    mobileDrawer.classList.remove("is-open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    hamburgerBtn.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    if (drawerOverlay) {
      drawerOverlay.classList.remove("is-open");
      drawerOverlay.setAttribute("aria-hidden", "true");
    }
    document.body.classList.remove("drawer-open");
    hamburgerBtn.focus();
  }

  /* ── Toggle on hamburger click ── */
  hamburgerBtn.addEventListener("click", function () {
    var isOpen = mobileDrawer.classList.contains("is-open");
    isOpen ? closeDrawer() : openDrawer();
  });

  /* ── Close on overlay click ── */
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", closeDrawer);
  }

  /* ── Close button ── */
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener("click", closeDrawer);
  }

  /* ── Close on Escape key ── */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  /* ── Sync cart count from main header to drawer badge ── */
  function syncCartCount() {
    var mainCount   = document.getElementById("cartCount");
    var drawerCount = document.getElementById("drawerCartCount");
    if (mainCount && drawerCount) {
      drawerCount.textContent = mainCount.textContent;
    }
  }

  syncCartCount();

  var cartCountEl = document.getElementById("cartCount");
  if (cartCountEl && window.MutationObserver) {
    var cartObserver = new MutationObserver(syncCartCount);
    cartObserver.observe(cartCountEl, { childList: true, subtree: true, characterData: true });
  }

  /* ── Drawer categories — sync active state with main rail ── */
  var drawerCats = document.querySelectorAll(".mobile-drawer__cat-item");
  var mainCatRail = document.getElementById("catRail");

  drawerCats.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      // Update drawer active state
      drawerCats.forEach(function (c) { c.classList.remove("is-active"); });
      item.classList.add("is-active");

      // Mirror to main category rail
      var catKey = item.getAttribute("data-cat");
      if (mainCatRail && catKey) {
        var mainCat = mainCatRail.querySelector('[data-cat="' + catKey + '"]');
        if (mainCat) {
          mainCatRail.querySelectorAll(".cat").forEach(function (c) { c.classList.remove("is-active"); });
          mainCat.classList.add("is-active");
        }
      }

      // Close the drawer after selecting
      closeDrawer();
    });
  });

  /* ── Mirror main rail active state to drawer on rail click ── */
  if (mainCatRail) {
    mainCatRail.addEventListener("click", function (e) {
      var cat = e.target.closest(".cat");
      if (!cat) return;
      var catKey = cat.getAttribute("data-cat");
      drawerCats.forEach(function (item) {
        item.classList.toggle("is-active", item.getAttribute("data-cat") === catKey);
      });
    });
  }
}
