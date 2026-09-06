// Sample Food Items with Real HD Images
const sampleFoodItems = [
    { 
        id: 1, 
        name: "Zinger Burger", 
        category: "Burgers", 
        price: 550, 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", 
        description: "Crispy fried chicken fillet topped with fresh lettuce and mayonnaise." 
    },
    { 
        id: 2, 
        name: "Beef Smash Burger", 
        category: "Burgers", 
        price: 750, 
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80", 
        description: "Juicy smashed beef patty with cheddar cheese and signature burger sauce." 
    },
    { 
        id: 3, 
        name: "Chicken Tikka Pizza", 
        category: "Pizza", 
        price: 1200, 
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", 
        description: "Traditional spicy chicken tikka chunks with onions and extra mozzarella cheese." 
    },
    { 
        id: 4, 
        name: "Pepperoni Delight", 
        category: "Pizza", 
        price: 1400, 
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", 
        description: "Classic Italian pepperoni slices over rich tomato sauce and cheese." 
    },
    { 
        id: 5, 
        name: "Crispy Fried Chicken", 
        category: "Chicken", 
        price: 850, 
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80", 
        description: "Golden crispy fried chicken pieces served with garlic mayonnaise dip." 
    },
    { 
        id: 6, 
        name: "Chocolate Lava Cake", 
        category: "Desserts", 
        price: 450, 
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", 
        description: "Warm dark chocolate cake filled with gooey molten chocolate center." 
    },
    { 
        id: 7, 
        name: "Cold Coffee", 
        category: "Drinks", 
        price: 350, 
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", 
        description: "Chilled blended espresso coffee topped with chocolate syrup and ice cream." 
    }
];

// Local Vendors Array
let vendors = [];
let cartCount = 0;

document.addEventListener("DOMContentLoaded", () => {
    renderFoodGrid(sampleFoodItems);
    setupEventListeners();
    renderVendors();
});

// Render Food Grid
function renderFoodGrid(items) {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;
    
    grid.innerHTML = items.map(item => `
        <div class="food-card">
            <img src="${item.image}" alt="${item.name}" class="food-card-img">
            <div class="food-card-body">
                <h5 class="food-title">${item.name}</h5>
                <span class="badge bg-secondary mb-2">${item.category}</span>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <strong class="text-white fs-6">Rs. ${item.price}</strong>
                    <button class="add-btn" data-id="${item.id}">+ Add</button>
                </div>
            </div>
        </div>
    `).join("");

    // Event Listener for Modal Trigger
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.getAttribute("data-id"));
            openFoodModal(id);
        });
    });
}

// Modal View
function openFoodModal(id) {
    const item = sampleFoodItems.find(f => f.id === id);
    if (!item) return;

    document.getElementById("detailImg").src = item.image;
    document.getElementById("detailName").innerText = item.name;
    document.getElementById("detailDescription").innerText = item.description;
    document.getElementById("detailPrice").innerText = `Rs. ${item.price}`;
    
    const addBtn = document.getElementById("detailAddBtn");
    addBtn.onclick = () => {
        cartCount++;
        const cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) cartCountEl.innerText = cartCount;
        alert(`${item.name} added to cart!`);
        const modalEl = document.getElementById("foodModal");
        if (modalEl && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
        }
    };

    const foodModalEl = document.getElementById("foodModal");
    if (foodModalEl && window.bootstrap) {
        const foodModal = new bootstrap.Modal(foodModalEl);
        foodModal.show();
    }
}

// Render Local Vendors
function renderVendors() {
    const vendorGrid = document.getElementById("vendorGrid");
    if (!vendorGrid) return;

    if (vendors.length === 0) {
        vendorGrid.innerHTML = `<p class="text-muted">No vendors added yet.</p>`;
        return;
    }

    vendorGrid.innerHTML = "";
    vendors.forEach((data) => {
        vendorGrid.innerHTML += `
            <div class="card bg-dark text-white p-3 border-secondary mb-3">
                <h5>${data.name}</h5>
                <p class="mb-1 text-muted"><i class="bi bi-geo-alt"></i> ${data.address}</p>
                <small class="text-secondary"><i class="bi bi-telephone"></i> ${data.phone}</small>
            </div>
        `;
    });
}

// Event Listeners Implementation
function setupEventListeners() {
    document.getElementById("authForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Logged in successfully!");
        const authModalEl = document.getElementById("authModal");
        if (authModalEl && window.bootstrap) {
            bootstrap.Modal.getInstance(authModalEl)?.hide();
        }
    });

    // Save Vendor Locally
    document.getElementById("vendorForm")?.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("vendorName").value;
        const phone = document.getElementById("vendorPhone").value;
        const address = document.getElementById("vendorAddress").value;

        vendors.push({
            name: name,
            phone: phone,
            address: address
        });

        alert("Vendor added successfully!");
        document.getElementById("vendorForm").reset();
        
        const vendorModalEl = document.getElementById("vendorModal");
        if (vendorModalEl && window.bootstrap) {
            bootstrap.Modal.getInstance(vendorModalEl)?.hide();
        }
        
        renderVendors();
    });

    document.getElementById("openVendorBtn")?.addEventListener("click", () => {
        const vendorModalEl = document.getElementById("vendorModal");
        if (vendorModalEl && window.bootstrap) {
            new bootstrap.Modal(vendorModalEl).show();
        }
    });
    
    document.getElementById("openVendorBtn2")?.addEventListener("click", () => {
        const vendorModalEl = document.getElementById("vendorModal");
        if (vendorModalEl && window.bootstrap) {
            new bootstrap.Modal(vendorModalEl).show();
        }
    });

    document.getElementById("sideLoginBtn")?.addEventListener("click", () => {
        const authModalEl = document.getElementById("authModal");
        if (authModalEl && window.bootstrap) {
            new bootstrap.Modal(authModalEl).show();
        }
    });
}
