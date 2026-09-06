import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const foodItemsData = [
  {
    id: "f1",
    name: "Classic Cheeseburger",
    category: "Burgers",
    price: 650,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    desc: "Juicy beef patty topped with melted cheddar, fresh lettuce, and special sauce."
  },
  {
    id: "f2",
    name: "Crispy Zinger Burger",
    category: "Burgers",
    price: 550,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    desc: "Crispy fried chicken fillet with spicy mayo and crunchy lettuce."
  },
  {
    id: "f3",
    name: "Pepperoni Passion Pizza",
    category: "Pizza",
    price: 1450,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    desc: "Loaded with double pepperoni, mozzarella cheese, and rich tomato sauce."
  },
  {
    id: "f4",
    name: "Creamy Alfredo Pasta",
    category: "Pasta",
    price: 890,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1621996346565-e3def6166739?auto=format&fit=crop&w=600&q=80",
    desc: "Penne pasta in rich white garlic sauce topped with grilled chicken."
  },
  {
    id: "f5",
    name: "BBQ Grilled Chicken",
    category: "Barbecue",
    price: 1200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    desc: "Smoky grilled chicken marinated in authentic BBQ spices."
  },
  {
    id: "f6",
    name: "Cold Brew Coffee",
    category: "Drinks",
    price: 380,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    desc: "Chilled espresso served with milk and ice."
  }
];

let cart = [];

function renderFoodGrid(items) {
  const foodGrid = document.getElementById("foodGrid");
  if (!foodGrid) return;

  foodGrid.innerHTML = items.map(item => `
    <div class="food-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="food-card-img" loading="lazy">
      <div class="food-card-body">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="badge bg-dark text-warning"><i class="bi bi-star-fill"></i> ${item.rating}</span>
          <small class="text-muted">${item.category}</small>
        </div>
        <h5 class="food-title">${item.name}</h5>
        <p class="text-muted small text-truncate" style="max-width: 200px;">${item.desc}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="fw-bold fs-5">Rs. ${item.price}</span>
          <button class="add-btn btn-add-cart" data-id="${item.id}">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const foodId = btn.getAttribute("data-id");
      addToCart(foodId);
    });
  });
}

function addToCart(foodId) {
  const item = foodItemsData.find(f => f.id === foodId);
  if (item) {
    cart.push(item);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.innerText = cart.length;

    try {
      const ordersRef = ref(db, "orders");
      push(ordersRef, {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.log(err);
    }
  }
}

function listenToVendors() {
  const vendorGrid = document.getElementById("vendorGrid");
  if (!vendorGrid) return;

  const vendorsRef = ref(db, "vendors");
  onValue(vendorsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const vendorList = Object.values(data);
      vendorGrid.innerHTML = vendorList.map(v => `
        <div class="card bg-dark text-white p-3 border-secondary rounded-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-warning text-dark fw-bold rounded-circle p-3 d-grid place-items-center" style="width: 48px; height: 48px;">
              ${v.name ? v.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">${v.name}</h6>
              <small class="text-muted"><i class="bi bi-geo-alt"></i> ${v.address}</small><br>
              <small class="text-warning"><i class="bi bi-telephone"></i> ${v.phone}</small>
            </div>
          </div>
        </div>
      `).join('');
    }
  });
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = foodItemsData.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.category.toLowerCase().includes(query)
    );
    renderFoodGrid(filtered);
  });
}

const vendorForm = document.getElementById("vendorForm");
if (vendorForm) {
  vendorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("vendorName")?.value;
    const phone = document.getElementById("vendorPhone")?.value;
    const address = document.getElementById("vendorAddress")?.value;

    if (name && phone && address) {
      const vendorsRef = ref(db, "vendors");
      push(vendorsRef, { name, phone, address, createdAt: new Date().toISOString() })
        .then(() => {
          alert("Vendor added successfully!");
          vendorForm.reset();
        })
        .catch(err => alert("Error: " + err.message));
    }
  });
}

const authForm = document.getElementById("authForm");
if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail")?.value;
    const password = document.getElementById("authPassword")?.value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Logged in successfully!");
      })
      .catch((err) => {
        alert("Auth Note: " + err.message);
      });
  });
}

onAuthStateChanged(auth, (user) => {
  const topUserName = document.getElementById("topUserName");
  const topAvatar = document.getElementById("topAvatar");
  
  if (user && topUserName) {
    topUserName.innerText = user.email.split('@')[0];
    if (topAvatar) topAvatar.innerText = user.email.charAt(0).toUpperCase();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderFoodGrid(foodItemsData);
  listenToVendors();
});
