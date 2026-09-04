import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const firebaseEnabled = !Object.values(firebaseConfig).some(value =>
    value.includes("YOUR_")
);

let app = null;
let auth = null;
let db = null;

if (firebaseEnabled) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}

const foods = [
    {
        id: "food1",
        name: "Classic Beef Burger",
        category: "Burgers",
        price: 650,
        icon: "🍔",
        description: "Juicy beef patty with fresh vegetables and signature sauce."
    },
    {
        id: "food2",
        name: "Crispy Chicken Burger",
        category: "Chicken",
        price: 590,
        icon: "🍗",
        description: "Crispy chicken fillet with lettuce and creamy sauce."
    },
    {
        id: "food3",
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 1450,
        icon: "🍕",
        description: "Loaded with pepperoni, mozzarella and rich pizza sauce."
    },
    {
        id: "food4",
        name: "Creamy Alfredo Pasta",
        category: "Chicken",
        price: 950,
        icon: "🍝",
        description: "Creamy pasta with chicken and parmesan cheese."
    },
    {
        id: "food5",
        name: "Chocolate Cake",
        category: "Desserts",
        price: 550,
        icon: "🍰",
        description: "Rich chocolate cake with smooth chocolate frosting."
    },
    {
        id: "food6",
        name: "Loaded Fries",
        category: "Chicken",
        price: 480,
        icon: "🍟",
        description: "Crispy fries loaded with cheese and spicy chicken."
    },
    {
        id: "food7",
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 220,
        icon: "🍋",
        description: "Freshly prepared chilled lemonade."
    },
    {
        id: "food8",
        name: "Cheese Pizza",
        category: "Pizza",
        price: 1250,
        icon: "🍕",
        description: "Classic cheese pizza with extra mozzarella."
    }
];

let vendors = [
    {
        id: "vendor1",
        name: "Food Men Kitchen",
        type: "Restaurant",
        category: "Fast Food",
        phone: "+92 300 1111111",
        address: "Karachi",
        description: "Fresh burgers, pizzas and delicious fast food."
    },
    {
        id: "vendor2",
        name: "Home Taste",
        type: "Home Chef",
        category: "Pakistani",
        phone: "+92 301 2222222",
        address: "Karachi",
        description: "Homemade Pakistani food prepared with care."
    },
    {
        id: "vendor3",
        name: "Fresh Pack Foods",
        type: "Packaged Food",
        category: "Packaged",
        phone: "+92 302 3333333",
        address: "Karachi",
        description: "Quality packaged food for homes and families."
    },
    {
        id: "vendor4",
        name: "Grand Palace Hotel",
        type: "Hotel",
        category: "Hotel",
        phone: "+92 303 4444444",
        address: "Karachi",
        description: "Premium hotel dining and hospitality services."
    },
    {
        id: "vendor5",
        name: "Grand Ballroom",
        type: "Hotel Ballroom / Event Venue",
        category: "Events",
        phone: "+92 304 5555555",
        address: "Karachi",
        description: "Elegant event venue for weddings and special occasions."
    },
    {
        id: "vendor6",
        name: "Sweet Bakery",
        type: "Bakery",
        category: "Bakery",
        phone: "+92 305 6666666",
        address: "Karachi",
        description: "Fresh cakes, pastries and bakery treats."
    }
];

let cart = JSON.parse(localStorage.getItem("foodMenCart") || "[]");
let orders = JSON.parse(localStorage.getItem("foodMenOrders") || "[]");
let currentUser = JSON.parse(localStorage.getItem("foodMenUser") || "null");
let currentFood = null;
let selectedCategory = "All";
let authMode = "login";

const authModal = new bootstrap.Modal(document.getElementById("authModal"));
const vendorModal = new bootstrap.Modal(document.getElementById("vendorModal"));
const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));
const foodModal = new bootstrap.Modal(document.getElementById("foodModal"));
const toast = new bootstrap.Toast(document.getElementById("appToast"));

function saveCart() {
    localStorage.setItem("foodMenCart", JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem("foodMenOrders", JSON.stringify(orders));
}

function saveUser() {
    if (currentUser) {
        localStorage.setItem("foodMenUser", JSON.stringify(currentUser));
    } else {
        localStorage.removeItem("foodMenUser");
    }
}

function showToast(message) {
    document.getElementById("toastMessage").textContent = message;
    toast.show();
}

function vendorIcon(type) {
    const icons = {
        "Restaurant": "bi-shop",
        "Home Chef": "bi-house-heart",
        "Packaged Food": "bi-box-seam",
        "Hotel": "bi-building",
        "Hotel Ballroom / Event Venue": "bi-calendar-event",
        "Bakery": "bi-cake2",
        "Café": "bi-cup-hot",
        "Catering Service": "bi-basket"
    };

    return icons[type] || "bi-shop";
}

function renderFoods() {
    const grid = document.getElementById("foodGrid");
    const search = document.getElementById("searchInput").value.trim().toLowerCase();

    const filtered = foods.filter(food => {
        const categoryMatch = selectedCategory === "All" || food.category === selectedCategory;
        const searchMatch =
            food.name.toLowerCase().includes(search) ||
            food.category.toLowerCase().includes(search) ||
            food.description.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    if (!filtered.length) {
        grid.innerHTML = `<div class="no-foods">No food found.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(food => `
        <article class="food-card">
            <div class="food-image" data-food="${food.id}">${food.icon}</div>
            <div class="food-info">
                <span class="food-category">${food.category}</span>
                <h4>${food.name}</h4>
                <p>${food.description}</p>
                <div class="food-meta">
                    <span class="food-price">Rs. ${food.price.toLocaleString()}</span>
                    <button class="add-food" data-add="${food.id}">
                        <i class="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join("");

    grid.querySelectorAll("[data-add]").forEach(button => {
        button.addEventListener("click", event => {
            event.stopPropagation();
            addToCart(button.dataset.add);
        });
    });

    grid.querySelectorAll("[data-food]").forEach(card => {
        card.addEventListener("click", () => openFood(card.dataset.food));
    });
}

function renderVendors() {
    const grid = document.getElementById("vendorGrid");

    if (!vendors.length) {
        grid.innerHTML = `<div class="no-foods">No vendors available.</div>`;
        return;
    }

    grid.innerHTML = vendors.map(vendor => `
        <article class="vendor-card">
            <div class="vendor-top">
                <div class="vendor-icon">
                    <i class="bi ${vendorIcon(vendor.type)}"></i>
                </div>
                <div>
                    <h4>${escapeHtml(vendor.name)}</h4>
                    <span class="vendor-type">${escapeHtml(vendor.type)}</span>
                </div>
                <span class="vendor-status">Active</span>
            </div>
            <p>${escapeHtml(vendor.description || "Quality food and professional service.")}</p>
            <div class="vendor-details">
                <span><i class="bi bi-geo-alt"></i>${escapeHtml(vendor.address || "Karachi")}</span>
                <span><i class="bi bi-tag"></i>${escapeHtml(vendor.category || "Food")}</span>
            </div>
        </article>
    `).join("");
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value || "";
    return div.innerHTML;
}

function renderCart() {
    const items = document.getElementById("cartItems");
    const empty = document.getElementById("cartEmpty");
    const footer = document.getElementById("cartFooter");

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;

    if (!cart.length) {
        items.innerHTML = "";
        empty.style.display = "grid";
        footer.style.display = "none";
        return;
    }

    empty.style.display = "none";
    footer.style.display = "block";

    items.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-icon">${item.icon}</div>
            <div class="cart-item-info">
                <h5>${escapeHtml(item.name)}</h5>
                <p>Rs. ${item.price.toLocaleString()}</p>
                <div class="qty-controls">
                    <button data-qty="${item.id}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button data-qty="${item.id}" data-change="1">+</button>
                    <button class="remove-item" data-remove="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = 150;
    const total = subtotal + delivery;

    document.getElementById("cartSubtotal").textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById("deliveryFee").textContent = `Rs. ${delivery.toLocaleString()}`;
    document.getElementById("cartTotal").textContent = `Rs. ${total.toLocaleString()}`;

    items.querySelectorAll("[data-change]").forEach(button => {
        button.addEventListener("click", () => {
            changeQuantity(button.dataset.qty, Number(button.dataset.change));
        });
    });

    items.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => {
            cart = cart.filter(item => item.id !== button.dataset.remove);
            saveCart();
            renderCart();
        });
    });
}

function addToCart(id) {
    const food = foods.find(item => item.id === id);
    if (!food) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            icon: food.icon,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    showToast(`${food.name} added to cart`);
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    renderCart();
}

function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("drawerOverlay").classList.add("show");
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("drawerOverlay").classList.remove("show");
}

function openFood(id) {
    currentFood = foods.find(food => food.id === id);
    if (!currentFood) return;

    document.getElementById("detailIcon").textContent = currentFood.icon;
    document.getElementById("detailCategory").textContent = currentFood.category;
    document.getElementById("detailName").textContent = currentFood.name;
    document.getElementById("detailDescription").textContent = currentFood.description;
    document.getElementById("detailPrice").textContent = `Rs. ${currentFood.price.toLocaleString()}`;

    foodModal.show();
}

function updateProfileUI() {
    const name = currentUser?.name || "Guest";
    const email = currentUser?.email || "Login to manage your account";
    const letter = name.charAt(0).toUpperCase();

    document.getElementById("topUserName").textContent = name;
    document.getElementById("topAvatar").textContent = letter;
    document.getElementById("profileAvatar").textContent = letter;
    document.getElementById("profileName").textContent = currentUser ? name : "Guest User";
    document.getElementById("profileEmail").textContent = email;

    document.getElementById("logoutBtn").classList.toggle("d-none", !currentUser);
    document.getElementById("profileLoginBtn").classList.toggle("d-none", !!currentUser);

    const sideButton = document.getElementById("sideLoginBtn");
    sideButton.innerHTML = currentUser
        ? `<i class="bi bi-person-check"></i><span>My Account</span>`
        : `<i class="bi bi-box-arrow-in-right"></i><span>Login</span>`;
}

function openLogin() {
    authMode = "login";
    updateAuthModal();
    authModal.show();
}

function openSignup() {
    authMode = "signup";
    updateAuthModal();
    authModal.show();
}

function updateAuthModal() {
    const signup = authMode === "signup";

    document.getElementById("authEyebrow").textContent = signup ? "Join Us" : "Welcome Back";
    document.getElementById("authTitle").textContent = signup ? "Create Your Account" : "Login to Food Men";
    document.getElementById("authSubmitBtn").textContent = signup ? "Create Account" : "Login";

    document.querySelectorAll(".signup-only").forEach(element => {
        element.classList.toggle("d-none", !signup);
    });

    document.getElementById("forgotBtn").classList.toggle("d-none", signup);

    document.getElementById("authSwitchText").innerHTML = signup
        ? `Already have an account? <button id="switchAuth">Login</button>`
        : `Don't have an account? <button id="switchAuth">Create account</button>`;

    document.getElementById("switchAuth").addEventListener("click", () => {
        authMode = signup ? "login" : "signup";
        updateAuthModal();
    });
}

async function login() {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    if (!email || !password) {
        showToast("Please enter email and password");
        return;
    }

    if (!firebaseEnabled) {
        currentUser = {
            uid: `demo-${Date.now()}`,
            name: email.split("@")[0],
            email
        };
        saveUser();
        updateProfileUI();
        authModal.hide();
        showToast("Logged in successfully");
        return;
    }

    try {
        const result = await signInWithEmailAndPassword(auth, email, password);

        currentUser = {
            uid: result.user.uid,
            name: result.user.displayName || email.split("@")[0],
            email: result.user.email
        };

        saveUser();
        updateProfileUI();
        authModal.hide();
        showToast("Login successful");
    } catch (error) {
        showToast(getFirebaseError(error));
    }
}

async function signup() {
    const name = document.getElementById("authName").value.trim();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    if (!name || !email || !password) {
        showToast("Please complete all fields");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters");
        return;
    }

    if (!firebaseEnabled) {
        currentUser = {
            uid: `demo-${Date.now()}`,
            name,
            email
        };
        saveUser();
        updateProfileUI();
        authModal.hide();
        showToast("Account created successfully");
        return;
    }

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(result.user, {
            displayName: name
        });

        await setDoc(doc(db, "users", result.user.uid), {
            name,
            email,
            role: "customer",
            createdAt: serverTimestamp()
        });

        currentUser = {
            uid: result.user.uid,
            name,
            email
        };

        saveUser();
        updateProfileUI();
        authModal.hide();
        showToast("Account created successfully");
    } catch (error) {
        showToast(getFirebaseError(error));
    }
}

async function forgotPassword() {
    const email = document.getElementById("authEmail").value.trim();

    if (!email) {
        showToast("Enter your email first");
        return;
    }

    if (!firebaseEnabled) {
        showToast("Demo mode: password reset requires Firebase");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showToast("Password reset email sent");
    } catch (error) {
        showToast(getFirebaseError(error));
    }
}

async function logout() {
    if (firebaseEnabled && auth.currentUser) {
        await signOut(auth);
    }

    currentUser = null;
    saveUser();
    updateProfileUI();
    showToast("Logged out successfully");
}

function continueAsGuest() {
    currentUser = {
        uid: `guest-${Date.now()}`,
        name: "Guest",
        email: "Guest Account",
        guest: true
    };

    saveUser();
    updateProfileUI();
    authModal.hide();
    showToast("Continuing as Guest");
}

async function submitVendor(event) {
    event.preventDefault();

    const name = document.getElementById("vendorName").value.trim();
    const type = document.getElementById("vendorType").value;
    const category = document.getElementById("vendorCategory").value.trim();
    const phone = document.getElementById("vendorPhone").value.trim();
    const address = document.getElementById("vendorAddress").value.trim();
    const description = document.getElementById("vendorDescription").value.trim();

    if (!name || !type) {
        showToast("Vendor name and type are required");
        return;
    }

    const vendorData = {
        name,
        type,
        category,
        phone,
        address,
        description,
        status: "Approved",
        createdAt: new Date().toISOString()
    };

    if (firebaseEnabled && auth.currentUser) {
        try {
            const vendorRef = await addDoc(collection(db, "vendors"), {
                ...vendorData,
                ownerId: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });

            vendors.unshift({
                id: vendorRef.id,
                ...vendorData
            });

            renderVendors();
            document.getElementById("vendorForm").reset();
            vendorModal.hide();
            document.getElementById("vendors").scrollIntoView({ behavior: "smooth" });
            showToast("Vendor added successfully");
            return;
        } catch (error) {
            showToast(getFirebaseError(error));
            return;
        }
    }

    vendors.unshift({
        id: `vendor-${Date.now()}`,
        ...vendorData
    });

    renderVendors();
    document.getElementById("vendorForm").reset();
    vendorModal.hide();
    document.getElementById("vendors").scrollIntoView({ behavior: "smooth" });
    showToast("Vendor added successfully");
}

function prepareCheckout() {
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + 150;

    document.getElementById("checkoutTotal").textContent = `Rs. ${total.toLocaleString()}`;
    checkoutModal.show();
}

async function placeOrder(event) {
    event.preventDefault();

    const address = document.getElementById("deliveryAddress").value.trim();
    const phone = document.getElementById("deliveryPhone").value.trim();
    const payment = document.getElementById("paymentMethod").value;

    if (!address || !phone) {
        showToast("Please complete delivery details");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const delivery = 150;
    const total = subtotal + delivery;

    const order = {
        id: `order-${Date.now()}`,
        customerId: currentUser?.uid || "guest",
        items: [...cart],
        subtotal,
        delivery,
        total,
        address,
        phone,
        paymentMethod: payment,
        status: "Confirmed",
        createdAt: new Date().toISOString()
    };

    if (firebaseEnabled && auth.currentUser) {
        try {
            const ref = await addDoc(collection(db, "orders"), {
                ...order,
                createdAt: serverTimestamp()
            });
            order.id = ref.id;
        } catch (error) {
            showToast(getFirebaseError(error));
            return;
        }
    }

    orders.unshift(order);
    saveOrders();

    cart = [];
    saveCart();
    renderCart();
    renderOrders();

    document.getElementById("checkoutForm").reset();
    checkoutModal.hide();
    closeCart();

    document.getElementById("orders").scrollIntoView({
        behavior: "smooth"
    });

    showToast("Order placed successfully");
}

function renderOrders() {
    const container = document.getElementById("ordersContainer");

    if (!orders.length) {
        container.innerHTML = `
            <div class="no-orders">
                <i class="bi bi-receipt"></i>
                <strong>No orders yet</strong>
                <p>Your placed orders will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.slice(0, 8).map(order => {
        const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const date = new Date(order.createdAt).toLocaleDateString();

        return `
            <div class="order-card">
                <div class="order-info">
                    <h4>Order #${escapeHtml(order.id.slice(-8))}</h4>
                    <p>${itemCount} item(s) · ${date} · ${escapeHtml(order.paymentMethod)}</p>
                </div>
                <span class="order-status">${escapeHtml(order.status)}</span>
                <strong class="order-total">Rs. ${order.total.toLocaleString()}</strong>
            </div>
        `;
    }).join("");
}

async function loadFirebaseData() {
    if (!firebaseEnabled) return;

    try {
        const vendorQuery = query(
            collection(db, "vendors"),
            where("status", "==", "Approved")
        );

        const vendorSnapshot = await getDocs(vendorQuery);

        const firebaseVendors = vendorSnapshot.docs.map(item => ({
            id: item.id,
            ...item.data()
        }));

        if (firebaseVendors.length) {
            const localIds = new Set(vendors.map(vendor => vendor.id));
            const newVendors = firebaseVendors.filter(vendor => !localIds.has(vendor.id));
            vendors = [...newVendors, ...vendors];
            renderVendors();
        }
    } catch (error) {
        console.log(error);
    }
}

function getFirebaseError(error) {
    const code = error?.code || "";

    const messages = {
        "auth/invalid-credential": "Invalid email or password",
        "auth/invalid-email": "Invalid email address",
        "auth/email-already-in-use": "Email is already registered",
        "auth/weak-password": "Password is too weak",
        "auth/user-not-found": "Account not found",
        "auth/wrong-password": "Incorrect password",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/network-request-failed": "Network error. Check your internet."
    };

    return messages[code] || "Something went wrong. Please try again.";
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("drawerOverlay").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", prepareCheckout);

document.getElementById("profileBtn").addEventListener("click", () => {
    if (currentUser) {
        document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
    } else {
        openLogin();
    }
});

document.getElementById("sideLoginBtn").addEventListener("click", () => {
    if (currentUser) {
        document.getElementById("profile").scrollIntoView({ behavior: "smooth" });
    } else {
        openLogin();
    }
});

document.getElementById("profileLoginBtn").addEventListener("click", openLogin);
document.getElementById("logoutBtn").addEventListener("click", logout);

document.getElementById("authSubmitBtn").addEventListener("click", () => {
    if (authMode === "login") {
        login();
    } else {
        signup();
    }
});

document.getElementById("forgotBtn").addEventListener("click", forgotPassword);
document.getElementById("guestBtn").addEventListener("click", continueAsGuest);

document.getElementById("togglePassword").addEventListener("click", () => {
    const input = document.getElementById("authPassword");
    const icon = document.querySelector("#togglePassword i");

    if (input.type === "password") {
        input.type = "text";
        icon.className = "bi bi-eye-slash";
    } else {
        input.type = "password";
        icon.className = "bi bi-eye";
    }
});

document.getElementById("vendorForm").addEventListener("submit", submitVendor);
document.getElementById("checkoutForm").addEventListener("submit", placeOrder);

document.getElementById("detailAddBtn").addEventListener("click", () => {
    if (!currentFood) return;
    addToCart(currentFood.id);
    foodModal.hide();
});

document.getElementById("openVendorBtn").addEventListener("click", () => vendorModal.show());
document.getElementById("openVendorBtn2").addEventListener("click", () => vendorModal.show());

document.getElementById("searchInput").addEventListener("input", renderFoods);

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.filter;

        document.querySelectorAll(".filter-btn").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        renderFoods();
    });
});

document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        document.querySelectorAll(".category-card").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        document.querySelectorAll(".filter-btn").forEach(item => {
            item.classList.toggle("active", item.dataset.filter === selectedCategory);
        });

        renderFoods();

        document.getElementById("menu").scrollIntoView({
            behavior: "smooth"
        });
    });
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
        link.classList.add("active");
        closeSidebar();
    });
});

function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("mobileOverlay").classList.add("show");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("mobileOverlay").classList.remove("show");
}

document.getElementById("menuToggle").addEventListener("click", openSidebar);
document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
document.getElementById("mobileOverlay").addEventListener("click", closeSidebar);

if (firebaseEnabled) {
    onAuthStateChanged(auth, user => {
        if (user) {
            currentUser = {
                uid: user.uid,
                name: user.displayName || user.email.split("@")[0],
                email: user.email
            };

            saveUser();
            updateProfileUI();
        }
    });
}

renderFoods();
renderVendors();
renderCart();
renderOrders();
updateProfileUI();
loadFirebaseData();