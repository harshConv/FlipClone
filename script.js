/* =================================
   LOAD COMPONENT
================================= */

function loadComponent(id, file) {

  fetch(file)

    .then(response => {

      if (!response.ok) {
        throw new Error("Unable to load " + file);
      }

      return response.text();

    })

    .then(html => {

      const element = document.getElementById(id);

      if (!element) return;

      element.innerHTML = html;


      /* Start component JavaScript */

      if (id === "Header") {
        initHeader();
      }

      if (id === "Advertise") {
        initAdvertiseSlider();
      }

    })

    .catch(error => {

      console.error(error);

    });
}


/* =================================
   HEADER
================================= */

function initHeader() {

  /* -------------------------------
     CATEGORY
  -------------------------------- */

  const catRail = document.getElementById("catRail");

  if (catRail) {

    catRail.addEventListener("click", function (event) {

      const category = event.target.closest(".cat");

      if (!category) return;

      event.preventDefault();


      /* Remove active */

      const oldCategory =
        catRail.querySelector(".cat.is-active");

      if (oldCategory) {
        oldCategory.classList.remove("is-active");
      }


      /* Add active */

      category.classList.add("is-active");

    });

  }


  /* -------------------------------
     SCROLL BEHAVIOR
  -------------------------------- */

  const siteHeader = document.getElementById("siteHeader");

  function handleScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 60) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();


  /* -------------------------------
     LOGIN DROPDOWN
  -------------------------------- */

  const loginBtn =
    document.getElementById("loginBtn");

  const loginDropdown =
    document.getElementById("loginDropdown");

  const loginWrap =
    document.getElementById("loginWrap");


  if (loginBtn && loginDropdown) {

    loginBtn.addEventListener("click", function (event) {

      event.preventDefault();

      event.stopPropagation();

      loginDropdown.classList.toggle("is-open");

    });


    /* Close when clicking outside */

    document.addEventListener("click", function (event) {

      if (
        loginWrap &&
        !loginWrap.contains(event.target)
      ) {

        loginDropdown.classList.remove("is-open");

      }

    });


    /* Close with Escape */

    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") {

        loginDropdown.classList.remove("is-open");

      }

    });

  }

}


/* =================================
   ADVERTISE BANNER
================================= */

function initAdvertiseSlider() {
  const pills = document.querySelectorAll(".ad-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", function () {
      pills.forEach(p => p.style.background = "rgba(255, 255, 255, 0.18)");
      this.style.background = "rgba(255, 255, 255, 0.35)";
    });
  });
}


loadComponent(
  "Header",
  "components/Header.html"
);

loadComponent(
  "Advertise",
  "components/Advertise.html"
);

loadComponent(
  "TopProducts",
  "components/TopProducts.html"
);

loadComponent(
  "products",
  "components/Products.html"
);

loadComponent(
  "footer",
  "components/footer.html"
);