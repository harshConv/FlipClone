/* ============================================================
   FLIPKART CLONE - MASTER SCRIPT (js/script.js)
   Asynchronously loads HTML components into the page and
   invokes component-specific initializers:
     • components/Header.html       -> initHeader() in js/Header.js
     • components/Advertise.html    -> initHeroSlider() in js/Advertise.js
     • components/Products.html     -> initProductInteractions() in js/Products.js
   ============================================================ */

/**
 * Load HTML component into specified mount container
 * @param {string} id - The DOM element ID to mount into
 * @param {string} file - The relative path to the HTML component file
 * @param {Function} [initCallback] - Optional callback function to initialize component
 */
function loadComponent(id, file, initCallback) {
  return fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component "${file}": ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (!container) {
        console.warn(`Mount container #${id} not found.`);
        return;
      }

      container.innerHTML = html;

      // Execute initializer callback if provided
      if (typeof initCallback === "function") {
        initCallback();
      }
    })
    .catch(error => {
      console.error(`Component load error for #${id}:`, error);
    });
}

/* ============================================================
   MOUNT ALL COMPONENTS IN STRICT CHRONOLOGY
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Header & Header Category Rail Sub-Component
  loadComponent("Header", "components/Header.html", function () {
    loadComponent("HeaderCats", "components/HeaderCats.html", function () {
      if (typeof initHeader === "function") initHeader();
    });
  });

  // 2. Hero Slider Banner
  loadComponent("SliderBanner", "components/Advertise.html", function () {
    if (typeof initHeroSlider === "function") initHeroSlider();
  });

  // 3. Interstitial Ad 1 (Flash Sale Flights & Mobiles)
  loadComponent("AdBanner1", "components/AdBanner1.html");

  // 4. Products (Revamped Real UI)
  loadComponent("products", "components/Products.html", function () {
    if (typeof initProductInteractions === "function") initProductInteractions();
  });

  // 5. Interstitial Ad 2 (Diwali Dhamaka / Festivals of India)
  loadComponent("AdBanner2", "components/AdBanner2.html");

  // 6. Top Deals (5 Themed Containers)
  loadComponent("TopProducts", "components/TopProducts.html");

  loadComponent("AdBanner3", "components/AdBanner3.html");
  // 7. Footer
  loadComponent("footer", "components/footer.html");
});
