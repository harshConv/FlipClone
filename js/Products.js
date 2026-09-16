/* ============================================================
   PRODUCTS SCRIPT (js/Products.js)
   Interactions for components/Products.html
   ============================================================ */

function initProductInteractions() {
  const wishlistButtons = document.querySelectorAll(".product-wishlist-btn");
  wishlistButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const isActive = this.classList.toggle("is-active");
      this.textContent = isActive ? "♥" : "♡";
      this.style.color = isActive ? "#ff3e6c" : "#878787";
    });
  });
}
