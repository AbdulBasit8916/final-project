// Data Models
const foodData = [
  { id: 1, name: 'Zinger Burger', category: 'Burgers', price: 550, icon: '🍔', desc: 'Crispy fried chicken thigh patty with mayo and lettuce.' },
  { id: 2, name: 'Beef Smash Burger', category: 'Burgers', price: 750, icon: '🍔', desc: 'Double beef patty with melted cheddar and special sauce.' },
  { id: 3, name: 'Chicken Tikka Pizza', category: 'Pizza', price: 1200, icon: '🍕', desc: 'Topped with spicy tikka chicken, onions, and mozzarella.' },
  { id: 4, name: 'Pepperoni Delight', category: 'Pizza', price: 1400, icon: '🍕', desc: 'Classic pepperoni with rich tomato sauce and extra cheese.' },
  { id: 5, name: 'Crispy Fried Chicken', category: 'Chicken', price: 850, icon: '🍗', desc: '4 pieces of hot & spicy golden fried chicken.' },
  { id: 6, name: 'Chocolate Lava Cake', category: 'Desserts', price: 450, icon: '🍰', desc: 'Warm chocolate cake with a molten chocolate center.' },
  { id: 7, name: 'Cold Coffee', category: 'Drinks', price: 350, icon: '🥤', desc: 'Chilled espresso blended with milk and ice cream.' }
];

let vendorsData = [
  { id: 1, name: 'Burger Lab', type: 'Restaurant', category: 'Fast Food', phone: '+92 300 1234567', address: 'Block 4, Clifton', desc: 'Best smash burgers in town.' },
  { id: 2, name: 'Pizza Max', type: 'Restaurant', category: 'Italian / Fast Food', phone: '+92 321 9876543', address: 'DHA Phase 5', desc: 'Authentic cheesy pizzas.' }
];

// App State
let cart = [];
let orders = [];
let currentUser = null;
let activeFilter = 'All';

// DOM Elements
const foodGrid = document.getElementById('foodGrid');
const vendorGrid = document.getElementById('vendorGrid');
const ordersContainer = document.getElementById('ordersContainer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');

// Modals Setup
let authModal, vendorModal, checkoutModal, foodModal;

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // Bootstrap Modals Initialization
  authModal = new bootstrap.Modal(document.getElementById('authModal'));
  vendorModal = new bootstrap.Modal(document.getElementById('vendorModal'));
  checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  foodModal = new bootstrap.Modal(document.getElementById('foodModal'));

  renderMenu();
  renderVendors();
  renderOrders();
  setupEventListeners();
});

// Render Functions
function renderMenu(searchTerm = '') {
  if (!foodGrid) return;
  foodGrid.innerHTML = '';
  
  const filtered = foodData.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    foodGrid.innerHTML = `<p class="text-muted col-12">No food items found.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-icon" onclick="openFoodDetail(${item.id})">${item.icon}</div>
      <div class="food-info">
        <h5>${item.name}</h5>
        <span class="badge bg-light text-dark mb-2">${item.category}</span>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <strong>Rs. ${item.price}</strong>
          <button class="btn btn-sm primary-btn" onclick="addToCart(${item.id})">
            <i class="bi bi-plus-lg"></i> Add
          </button>
        </div>
      </div>
    `;
    foodGrid.appendChild(card);
  });
}

function renderVendors() {
  if (!vendorGrid) return;
  vendorGrid.innerHTML = '';
  vendorsData.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vendor-card';
    card.innerHTML = `
      <h4>${v.name}</h4>
      <span class="eyebrow">${v.type} • ${v.category}</span>
      <p class="mt-2 mb-1"><i class="bi bi-geo-alt"></i> ${v.address}</p>
      <p><i class="bi bi-telephone"></i> ${v.phone}</p>
      <small class="text-muted">${v.desc}</small>
    `;
    vendorGrid.appendChild(card);
  });
}

function renderOrders() {
  if (!ordersContainer) return;
  ordersContainer.innerHTML = '';
  if (orders.length === 0) {
    ordersContainer.innerHTML = `<p class="text-muted">No recent orders found.</p>`;
    return;
  }
  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Order #${order.id}</strong>
        <span class="badge bg-success">${order.status}</span>
      </div>
      <p class="mb-1 text-muted">${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</p>
      <div class="d-flex justify-content-between">
        <small>${order.date}</small>
        <strong>Rs. ${order.total}</strong>
      </div>
    `;
    ordersContainer.appendChild(card);
  });
}

// Cart System Logic
window.addToCart = function(id) {
  const item = foodData.find(f => f.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  showToast(`${item.name} added to cart!`);
};

function updateCartUI() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal > 0 ? subtotal + 150 : 0;

  if (cartCount) cartCount.textContent = totalCount;
  if (cartSubtotal) cartSubtotal.textContent = `Rs. ${subtotal}`;
  if (cartTotal) cartTotal.textContent = `Rs. ${total}`;
  
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutTotal) checkoutTotal.textContent = `Rs. ${total}`;

  const cartEmpty = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.classList.remove('d-none');
    if (cartFooter) cartFooter.classList.add('d-none');
    if (cartItems) cartItems.innerHTML = '';
  } else {
    if (cartEmpty) cartEmpty.classList.add('d-none');
    if (cartFooter) cartFooter.classList.remove('d-none');
    
    if (cartItems) {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div>
            <h6>${item.name}</h6>
            <small>Rs. ${item.price} x ${item.qty}</small>
          </div>
          <div class="cart-controls">
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, -1)">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join('');
    }
  }
}

window.changeQty = function(id, delta) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
  }
  updateCartUI();
};

// Cart Drawer Functionality
function toggleCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (cartDrawer && drawerOverlay) {
    cartDrawer.classList.toggle('active');
    drawerOverlay.classList.toggle('active');
  }
}

// Modal Detail View
window.openFoodDetail = function(id) {
  const item = foodData.find(f => f.id === id);
  document.getElementById('detailIcon').textContent = item.icon;
  document.getElementById('detailCategory').textContent = item.category;
  document.getElementById('detailName').textContent = item.name;
  document.getElementById('detailDescription').textContent = item.desc;
  document.getElementById('detailPrice').textContent = `Rs. ${item.price}`;
  document.getElementById('detailAddBtn').onclick = () => {
    addToCart(item.id);
    foodModal.hide();
  };
  foodModal.show();
};

function setupEventListeners() {
  // Cart Trigger Events
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const drawerOverlay = document.getElementById('drawerOverlay');

  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCart();
    });
  }
  if (closeCart) closeCart.addEventListener('click', toggleCart);
  if (drawerOverlay) drawerOverlay.addEventListener('click', toggleCart);

  // Mobile Sidebar Toggles
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (menuToggle) {
    menuToggle.onclick = () => {
      document.getElementById('sidebar')?.classList.add('active');
      mobileOverlay?.classList.add('active');
    };
  }
  
  if (sidebarClose) sidebarClose.onclick = closeSidebar;
  if (mobileOverlay) mobileOverlay.onclick = closeSidebar;

  function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
  }

  // Search Input Filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderMenu(e.target.value);
    });
  }

  // Category & Filter Buttons
  document.querySelectorAll('.filter-btn, .category-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn, .category-card').forEach(b => b.classList.remove('active'));
      const category = e.currentTarget.dataset.category || e.currentTarget.dataset.filter;
      activeFilter = category;
      
      document.querySelectorAll(`[data-filter="${category}"], [data-category="${category}"]`)
        .forEach(b => b.classList.add('active'));
      
      renderMenu();
    });
  });

  // Auth Modal Controls
  const openAuth = () => authModal.show();
  document.getElementById('sideLoginBtn')?.addEventListener('click', openAuth);
  document.getElementById('profileLoginBtn')?.addEventListener('click', openAuth);
  document.getElementById('profileBtn')?.addEventListener('click', openAuth);

  const switchAuth = document.getElementById('switchAuth');
  if (switchAuth) {
    switchAuth.onclick = (e) => {
      e.preventDefault();
      const signupField = document.querySelector('.signup-only');
      const isSignup = signupField.classList.toggle('d-none');
      document.getElementById('authTitle').textContent = !isSignup ? 'Create Account' : 'Login to Food Men';
      e.target.textContent = !isSignup ? 'Already have an account? Login' : 'Create account';
    };
  }

  document.getElementById('authSubmitBtn')?.addEventListener('click', () => {
    const email = document.getElementById('authEmail').value || 'User';
    currentUser = { name: email.split('@')[0], email: email };
    updateUserUI();
    authModal.hide();
    showToast(`Welcome back, ${currentUser.name}!`);
  });

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    currentUser = null;
    updateUserUI();
    showToast('Logged out successfully.');
  });

  // Vendor Registration
  const openVendor = () => vendorModal.show();
  document.getElementById('openVendorBtn')?.addEventListener('click', openVendor);
  document.getElementById('openVendorBtn2')?.addEventListener('click', openVendor);

  const vendorForm = document.getElementById('vendorForm');
  if (vendorForm) {
    vendorForm.onsubmit = (e) => {
      e.preventDefault();
      const newVendor = {
        id: Date.now(),
        name: document.getElementById('vendorName').value,
        type: document.getElementById('vendorType').value,
        category: document.getElementById('vendorCategory').value,
        phone: document.getElementById('vendorPhone').value,
        address: document.getElementById('vendorAddress').value,
        desc: document.getElementById('vendorDescription').value
      };
      vendorsData.push(newVendor);
      renderVendors();
      vendorModal.hide();
      e.target.reset();
      showToast('Vendor registered successfully!');
    };
  }

  // Checkout Processing
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    toggleCart();
    checkoutModal.show();
  });

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.onsubmit = (e) => {
      e.preventDefault();
      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
      const newOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        items: [...cart],
        total: subtotal + 150,
        status: 'Preparing',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      orders.unshift(newOrder);
      cart = [];
      updateCartUI();
      renderOrders();
      checkoutModal.hide();
      showToast('Order placed successfully!');
    };
  }
}

function updateUserUI() {
  if (currentUser) {
    document.getElementById('topUserName').textContent = currentUser.name;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('topAvatar').textContent = currentUser.name[0].toUpperCase();
    document.getElementById('profileAvatar').textContent = currentUser.name[0].toUpperCase();
    document.getElementById('profileLoginBtn')?.classList.add('d-none');
    document.getElementById('logoutBtn')?.classList.remove('d-none');
  } else {
    document.getElementById('topUserName').textContent = 'Guest';
    document.getElementById('profileName').textContent = 'Guest User';
    document.getElementById('profileEmail').textContent = 'Login to manage your account';
    document.getElementById('topAvatar').textContent = 'G';
    document.getElementById('profileAvatar').textContent = 'G';
    document.getElementById('profileLoginBtn')?.classList.remove('d-none');
    document.getElementById('logoutBtn')?.classList.add('d-none');
  }
}

function showToast(message) {
  const toastEl = document.getElementById('appToast');
  if (!toastEl) return;
  document.getElementById('toastMessage').textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
