// Food Items Data
const foods = [
  { id: 1, name: "Zinger Burger", category: "burgers", price: "$5.99", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
  { id: 2, name: "Cheese Pizza", category: "pizza", price: "$9.99", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" },
  { id: 3, name: "Fried Chicken", category: "chicken", price: "$7.50", img: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400" },
  { id: 4, name: "Chocolate Cake", category: "desserts", price: "$4.00", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
  { id: 5, name: "Cold Drink", category: "drinks", price: "$1.50", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400" }
];

// Vendor Data
const vendors = [
  { id: 1, name: "KFC Fast Food", desc: "Fast Food • 15 min", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
  { id: 2, name: "Pizza Max", desc: "Italian • 25 min", img: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400" }
];

let cartCount = 0;

// Render Food Cards
function renderFoods(items) {
  const container = document.getElementById("foodGrid");
  container.innerHTML = items.map(food => `
    <div class="card">
      <img src="${food.img}" alt="${food.name}">
      <div class="card-body">
        <div class="card-title">${food.name}</div>
        <div class="card-action">
          <span class="card-price">${food.price}</span>
          <button class="add-btn" onclick="addToCart('${food.name}')">Add +</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Vendors
function renderVendors() {
  const container = document.getElementById("vendorGrid");
  container.innerHTML = vendors.map(v => `
    <div class="card">
      <img src="${v.img}" alt="${v.name}">
      <div class="card-body">
        <div class="card-title">${v.name}</div>
        <div style="font-size: 11px; color: #808191;">${v.desc}</div>
      </div>
    </div>
  `).join('');
}

// Button Functionalities
function filterCategory(cat, element) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  if (cat === 'all') {
    renderFoods(foods);
  } else {
    const filtered = foods.filter(f => f.category === cat);
    renderFoods(filtered);
  }
}

function handleSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = foods.filter(f => f.name.toLowerCase().includes(query));
  renderFoods(filtered);
}

function addToCart(itemName) {
  cartCount++;
  document.getElementById('cartCount').innerText = cartCount;
  alert(`${itemName} cart mein add ho gaya hai!`);
}

function openCart() {
  alert(`Aapke cart mein total ${cartCount} items hain.`);
}

function setActiveNav(element) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function triggerAddVendor() {
  alert("Add Vendor form option open ho gaya hai.");
}

function triggerLogin() {
  alert("Login Page / Modal redirect.");
}

// Initialization
window.onload = () => {
  renderFoods(foods);
  renderVendors();
};
