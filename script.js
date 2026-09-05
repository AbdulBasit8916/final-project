// Sample Data (Images included)
const foods = [
  { id: 1, name: "Cheeseburger", category: "burgers", price: 8.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
  { id: 2, name: "Pepperoni Pizza", category: "pizza", price: 12.99, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
  { id: 3, name: "Crispy Fried Chicken", category: "chicken", price: 9.99, img: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400" },
  { id: 4, name: "Chocolate Cake", category: "desserts", price: 4.99, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
  { id: 5, name: "Iced Cola", category: "drinks", price: 2.50, img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" }
];

const vendors = [
  { id: 1, name: "Burger King", desc: "Fast Food • 20 mins", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
  { id: 2, name: "Pizza Hut", desc: "Italian • 30 mins", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400" },
  { id: 3, name: "KFC", desc: "Chicken • 15 mins", img: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400" }
];

let cart = [];

// Render Food Items
function renderFoods(items) {
  const grid = document.getElementById("foodGrid");
  grid.innerHTML = items.map(food => `
    <div class="card">
      <img src="${food.img}" alt="${food.name}">
      <div class="card-info">
        <h4>${food.name}</h4>
        <p>Delicious & Fresh</p>
        <div class="card-footer">
          <span class="price">$${food.price.toFixed(2)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart(${food.id})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Vendors
function renderVendors() {
  const grid = document.getElementById("vendorGrid");
  grid.innerHTML = vendors.map(v => `
    <div class="card">
      <img src="${v.img}" alt="${v.name}">
      <div class="card-info">
        <h4>${v.name}</h4>
        <p>${v.desc}</p>
        <button class="btn btn-outline btn-sm" onclick="alert('Viewing vendor details!')">View Store</button>
      </div>
    </div>
  `).join('');
}

// Category Filter Functionality
function filterCategory(category, element) {
  document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  if (category === 'all') {
    renderFoods(foods);
  } else {
    const filtered = foods.filter(item => item.category === category);
    renderFoods(filtered);
  }
}

// Search Functionality
function searchFood() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = foods.filter(food => food.name.toLowerCase().includes(query));
  renderFoods(filtered);
}

// Add to Cart
function addToCart(foodId) {
  const item = foods.find(f => f.id === foodId);
  cart.push(item);
  document.getElementById('cartCount').innerText = cart.length;
  alert(`${item.name} added to cart!`);
}

// Cart Modal Control
function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (modal.style.display === 'flex') {
    modal.style.display = 'none';
  } else {
    modal.style.display = 'flex';
    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty.</p>';
      cartTotal.innerText = '0.00';
    } else {
      cartItems.innerHTML = cart.map(i => `<p style="margin-bottom:8px;">${i.name} - $${i.price.toFixed(2)}</p>`).join('');
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartTotal.innerText = total.toFixed(2);
    }
  }
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Order placed successfully!");
    cart = [];
    document.getElementById('cartCount').innerText = 0;
    toggleCartModal();
  }
}

// Navigation Helper
function setActiveNav(element) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function handleLogin() {
  alert("Login modal / redirect clicked.");
}

function openVendorModal() {
  alert("Add Vendor form opened.");
}

// Initial Load
window.onload = () => {
  renderFoods(foods);
  renderVendors();
};
