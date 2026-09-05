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
const cartDrawer = document.getElementById('cartDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobileOverlay');

// Bootstrap Modals
const authModal = new bootstrap.Modal(document.getElementById('authModal'));
const vendorModal = new bootstrap.Modal(document.getElementById('vendorModal'));
const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
const foodModal = new bootstrap.Modal(document.getElementById('foodModal'));

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  renderVendors();
  renderOrders();
  setupEventListeners();
});

// Render Functions
function renderMenu(searchTerm = '') {
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

  cartCount.textContent = totalCount;
  cartSubtotal.textContent = `Rs. ${subtotal}`;
  cartTotal.textContent = `Rs. ${total}`;
  document.getElementById('checkoutTotal').textContent = `Rs. ${total}`;

  if (cart.length === 0) {
    document.getElementById('cartEmpty').classList.remove('d-none');
    document.getElementById('cartFooter').classList.add('d-none');
    cartItems.innerHTML = '';
  } else {
    document.getElementById('cartEmpty').classList.add('d-none');
    document.getElementById('cartFooter').classList.remove('d-none');
    
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <h6>${item.name}</h6>
          <small>Rs. ${item.price} x ${item.qty}</small>
        </div>
        <div class="cart-controls">
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
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

// Modal & Overlay Handlers
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
  // Sidebar Toggles
  document.getElementById('menuToggle').onclick = () => {
    sidebar.classList.add('active');
    mobileOverlay.classList.add('active');
  };
  document.getElementById('sidebarClose').onclick = closeSidebar;
  mobileOverlay.onclick = closeSidebar;

  function closeSidebar() {
    sidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
  }

  // Cart Drawer
  document.getElementById('cartBtn').onclick = toggleCart;
  document.getElementById('closeCart').onclick = toggleCart;
  drawerOverlay.onclick = toggleCart;

  function toggleCart() {
    cartDrawer.classList.toggle('active');
    drawerOverlay.classList.toggle('active');
  }

  // Search Input
  document.getElementById('searchInput').addEventListener('input', (e) => {
    renderMenu(e.target.value);
  });

  // Filter & Category Buttons
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

  // Authentication Modals & Logic
  const openAuth = () => authModal.show();
  document.getElementById('sideLoginBtn').onclick = openAuth;
  document.getElementById('profileLoginBtn').onclick = openAuth;
  document.getElementById('profileBtn').onclick = openAuth;

  document.getElementById('switchAuth').onclick = (e) => {
    const isSignup = document.querySelector('.signup-only').classList.toggle('d-none');
    document.getElementById('authTitle').textContent = isSignup ? 'Login to Food Men' : 'Create Account';
    e.target.textContent = isSignup ? 'Create account' : 'Already have an account? Login';
  };

  document.getElementById('authSubmitBtn').onclick = () => {
    const email = document.getElementById('authEmail').value || 'User';
    currentUser = { name: email.split('@')[0], email: email };
    updateUserUI();
    authModal.hide();
    showToast(`Welcome back, ${currentUser.name}!`);
  };

  document.getElementById('logoutBtn').onclick = () => {
    currentUser = null;
    updateUserUI();
    showToast('Logged out successfully.');
  };

  // Vendor Add Logic
  const openVendor = () => vendorModal.show();
  document.getElementById('openVendorBtn').onclick = openVendor;
  document.getElementById('openVendorBtn2').onclick = openVendor;

  document.getElementById('vendorForm').onsubmit = (e) => {
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

  // Checkout Logic
  document.getElementById('checkoutBtn').onclick = () => {
    toggleCart();
    checkoutModal.show();
  };

  document.getElementById('checkoutForm').onsubmit = (e) => {
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

function updateUserUI() {
  if (currentUser) {
    document.getElementById('topUserName').textContent = currentUser.name;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('topAvatar').textContent = currentUser.name[0].toUpperCase();
    document.getElementById('profileAvatar').textContent = currentUser.name[0].toUpperCase();
    document.getElementById('profileLoginBtn').classList.add('d-none');
    document.getElementById('logoutBtn').classList.remove('d-none');
  } else {
    document.getElementById('topUserName').textContent = 'Guest';
    document.getElementById('profileName').textContent = 'Guest User';
    document.getElementById('profileEmail').textContent = 'Login to manage your account';
    document.getElementById('topAvatar').textContent = 'G';
    document.getElementById('profileAvatar').textContent = 'G';
    document.getElementById('profileLoginBtn').classList.remove('d-none');
    document.getElementById('logoutBtn').classList.add('d-none');
  }
}

function showToast(message) {
  const toastEl = document.getElementById('appToast');
  document.getElementById('toastMessage').textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
