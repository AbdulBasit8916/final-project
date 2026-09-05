// ==========================================
// 1. GLOBAL STATE & SELECTORS
// ==========================================
let cart = [];

// Demo Credentials (Yahan aap apni sahi Email/Password set kar sakte hain)
const VALID_EMAIL = "user@gmail.com";
const VALID_PASSWORD = "password123";

// Standard Email Regex Pattern (Har qism ki email format check karne ke liye)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ==========================================
// 2. AUTHENTICATION & VALIDATION
// ==========================================
function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorElement = document.getElementById("login-error");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  // Reset Input Borders
  if (emailInput) emailInput.style.borderColor = "var(--border-color)";
  if (passwordInput) passwordInput.style.borderColor = "var(--border-color)";

  // 1. Empty Check
  if (!email || !password) {
    showError(errorElement, "Please enter both email and password.");
    if (!email && emailInput) emailInput.style.borderColor = "#ff5722";
    if (!password && passwordInput) passwordInput.style.borderColor = "#ff5722";
    return;
  }

  // 2. Email Pattern Check (Saree invalid formats ke liye)
  if (!EMAIL_REGEX.test(email)) {
    showError(errorElement, "Ghalat Gmail / Email format! Sahi email enter karein.");
    if (emailInput) emailInput.style.borderColor = "#ff5722";
    return;
  }

  // 3. Incorrect Password or Email Check
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    showError(errorElement, "Ghalat Email ya Password! Dobara koshish karein.");
    if (emailInput) emailInput.style.borderColor = "#ff5722";
    if (passwordInput) passwordInput.style.borderColor = "#ff5722";
    return;
  }

  // Success
  if (errorElement) errorElement.style.display = "none";
  showToast("Login Successful!");
  
  // Close Modal if using Bootstrap/Custom Modal
  const loginModalEl = document.getElementById("loginModal");
  if (loginModalEl && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(loginModalEl);
    if (modal) modal.hide();
  }
}

function showError(element, message) {
  if (element) {
    element.innerText = message;
    element.style.display = "block";
  } else {
    showToast(message);
  }
}

// ==========================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================
function showToast(message) {
  // Check if toast already exists, remove it
  let existingToast = document.querySelector(".toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  // Create Toast Element
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `<i class="bi bi-check-circle-fill" style="color:#4caf50;"></i> <span>${message}</span>`;

  document.body.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.4s ease";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ==========================================
// 4. CART & DRAWER FUNCTIONS
// ==========================================
function addToCart(itemName, price, imageSrc) {
  const existingItem = cart.find((item) => item.name === itemName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: itemName, price: price, image: imageSrc, quantity: 1 });
  }

  updateCartUI();
  showToast(`${itemName} added to cart!`);
}

function updateCartUI() {
  const cartCountEl = document.querySelector(".cart-count");
  const cartItemsContainer = document.querySelector(".cart-items");
  
  // Total Quantity Count
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.innerText = totalCount;

  // Render Cart Items
  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 2rem;">Your cart is empty.</p>`;
      return;
    }

    cart.forEach((item, index) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${item.image || 'https://via.placeholder.com/50'}" class="cart-item-img" alt="${item.name}">
          <div>
            <h6 style="margin: 0; color: var(--text-main); font-weight: 600;">${item.name}</h6>
            <small style="color: var(--text-muted);">Rs. ${item.price} x ${item.quantity}</small>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" class="close-btn" style="color: #ff5722;">&times;</button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
  showToast("Item removed from cart.");
}

function toggleCart() {
  const cartDrawer = document.querySelector(".cart-drawer");
  const drawerOverlay = document.querySelector(".drawer-overlay");

  if (cartDrawer) cartDrawer.classList.toggle("active");
  if (drawerOverlay) drawerOverlay.classList.toggle("active");
}

// ==========================================
// 5. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Attach Login Event
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Cart Toggle Listeners
  const cartBtn = document.querySelector(".top-actions .icon-btn");
  const closeCartBtn = document.querySelector(".cart-drawer .close-btn");
  const drawerOverlay = document.querySelector(".drawer-overlay");

  if (cartBtn) cartBtn.addEventListener("click", toggleCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
  if (drawerOverlay) drawerOverlay.addEventListener("click", toggleCart);
});
