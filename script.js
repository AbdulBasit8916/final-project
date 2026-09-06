import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // 👈 Config radio button click karke jo API Key milegi wo yahan likhein
  authDomain: "good-food-good-mood-a6a35.firebaseapp.com",
  databaseURL: "https://good-food-good-mood-a6a35-default-rtdb.firebaseio.com",
  projectId: "good-food-good-mood-a6a35",
  storageBucket: "good-food-good-mood-a6a35.appspot.com",
  messagingSenderId: "632916799004",
  appId: "1:632916799004:web:329938c2857fec6f9db9d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// FOOD ITEMS DATA WITH REAL IMAGES
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

// 1. RENDER FOOD MENU GRID
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
        <p class="text-muted small text-truncate">${item.desc}</p>
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

// 2. ADD TO CART & FIREBASE ORDER SYNC
function addToCart(foodId) {
  const item = foodItemsData.find(f => f.id === foodId);
  if (item) {
    cart.push(item);
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) cartCountEl.innerText = cart.length;

    try {
      push(ref(db, "orders"), {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.log("Database Sync Note:", err);
    }
  }
}

// 3. SEARCH FILTER
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

// 4. FIREBASE AUTHENTICATION (LOGIN & AUTO-SIGNUP)
const authForm = document.getElementById("authForm");
if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Login successful!");
        closeModal('authModal');
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
              alert("Account created and logged in!");
              closeModal('authModal');
            })
            .catch(error => alert(error.message));
        } else {
          alert("Firebase Error: " + err.message);
        }
      });
  });
}

// 5. USER STATE SYNC
onAuthStateChanged(auth, (user) => {
  const topUserName = document.getElementById("topUserName");
  const topAvatar = document.getElementById("topAvatar");
  
  if (user) {
    if (topUserName) topUserName.innerText = user.email.split('@')[0];
    if (topAvatar) topAvatar.innerText = user.email.charAt(0).toUpperCase();
  }
});

// 6. ADD VENDOR TO FIREBASE DATABASE
const vendorForm = document.getElementById("vendorForm");
if (vendorForm) {
  vendorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("vendorName").value;
    const phone = document.getElementById("vendorPhone").value;
    const address = document.getElementById("vendorAddress").value;

    push(ref(db, "vendors"), {
      name: name,
      phone: phone,
      address: address,
      createdAt: new Date().toISOString()
    })
    .then(() => {
      alert("Vendor added successfully!");
      vendorForm.reset();
      closeModal('vendorModal');
    })
    .catch((err) => alert("Database Error: " + err.message));
  });
}

// 7. LISTEN TO REALTIME VENDORS FROM DATABASE
function listenToVendors() {
  const vendorGrid = document.getElementById("vendorGrid");
  if (!vendorGrid) return;

  onValue(ref(db, "vendors"), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const vendorList = Object.values(data);
      vendorGrid.innerHTML = vendorList.map(v => `
        <div class="card bg-dark text-white p-3 border-secondary rounded-3">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-warning text-dark fw-bold rounded-circle p-3 d-grid place-items-center" style="width: 44px; height: 44px;">
              ${v.name ? v.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <h6 class="mb-0 fw-bold">${v.name}</h6>
              <small class="text-muted">${v.address}</small><br>
              <small class="text-warning">${v.phone}</small>
            </div>
          </div>
        </div>
      `).join('');
    }
  });
}

function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement && window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFoodGrid(foodItemsData);
  listenToVendors();
});
