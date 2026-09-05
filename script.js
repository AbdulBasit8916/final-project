// Sample Data with Real High-Quality Images
const sampleFoodItems = [
    { id: 1, name: "Zinger Burger Special", category: "Burgers", price: 550, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", description: "Crispy fried chicken thigh fillet with fresh lettuce and mayo." },
    { id: 2, name: "Pepperoni Passion Pizza", category: "Pizza", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", description: "Loaded with pepperoni, mozzarella cheese and hot tomato sauce." },
    { id: 3, name: "Crispy Fried Chicken (3 Pcs)", category: "Chicken", price: 750, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80", description: "Golden juicy crispy fried chicken pieces with dip." },
    { id: 4, name: "Chocolate Lava Cake", category: "Desserts", price: 400, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", description: "Warm chocolate cake with a molten chocolate center." },
    { id: 5, name: "Chilled Mint Margarita", category: "Drinks", price: 250, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", description: "Refreshing blend of fresh mint leaves, lemon, and soda." },
    { id: 6, name: "Smokey BBQ Beef Burger", category: "Burgers", price: 790, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80", description: "Juicy beef patty topped with cheddar cheese and smoky BBQ sauce." }
];

const sampleVendors = [
    { id: 1, name: "KFC - Gulberg", type: "Restaurant", category: "Fast Food", phone: "03001234567", address: "Main Boulevard Gulberg, Lahore", description: "Finger Lickin' Good fried chicken and burgers.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "Mama's Kitchen", type: "Home Chef", category: "Pakistani", phone: "03219876543", address: "DHA Phase 5, Karachi", description: "Hygienic home-cooked traditional meals.", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80" }
];

let cart = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    renderFoodGrid(sampleFoodItems);
    renderVendors(sampleVendors);
    setupEventListeners();
});

// Render Food Grid
function renderFoodGrid(items) {
    const grid = document.getElementById("foodGrid");
    if (!grid) return;
    
    grid.innerHTML = items.map(item => `
        <div class="food-card">
            <img src="${item.image}" class="food-card-img" alt="${item.name}" style="height: 180px; width: 100%; object-fit: cover;">
            <div class="food-card-body p-3">
                <span class="badge bg-secondary mb-1">${item.category}</span>
                <h5 class="food-title mt-1">${item.name}</h5>
                <p class="text-muted small">${item.description.substring(0, 50)}...</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <strong class="text-white">Rs. ${item.price}</strong>
                    <button class="btn btn-sm primary-btn" onclick="openFoodModal(${item.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join("");
}

// Render Vendor Grid
function renderVendors(vendors) {
    const grid = document.getElementById("vendorGrid");
    if (!grid) return;

    grid.innerHTML = vendors.map(v => `
        <div class="vendor-card p-3 border border-secondary rounded mb-3 bg-dark text-white">
            <div class="d-flex gap-3 align-items-center">
                <img src="${v.image}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">
                <div>
                    <h5 class="mb-1">${v.name} <span class="badge bg-primary fs-6">${v.type}</span></h5>
                    <p class="mb-1 text-muted small">${v.category} | <i class="bi bi-geo-alt"></i> ${v.address}</p>
                    <p class="mb-0 small"><i class="bi bi-telephone"></i> ${v.phone}</p>
                </div>
            </div>
        </div>
    `).join("");
}

// Open Detailed View
function openFoodModal(id) {
    const item = sampleFoodItems.find(f => f.id === id);
    if (!item) return;

    document.getElementById("detailImg").src = item.image;
    document.getElementById("detailName").innerText = item.name;
    document.getElementById("detailCategory").innerText = item.category;
    document.getElementById("detailDescription").innerText = item.description;
    document.getElementById("detailPrice").innerText = `Rs. ${item.price}`;
    
    const addBtn = document.getElementById("detailAddBtn");
    addBtn.onclick = () => {
        addToCart(item);
        const modalEl = document.getElementById("foodModal");
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
    };

    const foodModal = new bootstrap.Modal(document.getElementById("foodModal"));
    foodModal.show();
}

// Add to Cart
function addToCart(item) {
    cart.push(item);
    document.getElementById("cartCount").innerText = cart.length;
    showToast(`${item.name} added to cart!`);
}

// Toast Helper
function showToast(msg) {
    document.getElementById("toastMessage").innerText = msg;
    const toastEl = document.getElementById("appToast");
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Event Listeners and Validations
function setupEventListeners() {
    // Auth Form Logic
    const authForm = document.getElementById("authForm");
    if(authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("authEmail").value;
            
            if(!email.endsWith("@gmail.com")) {
                alert("Please enter a valid Gmail address (ending with @gmail.com)");
                return;
            }
            
            showToast("Successfully logged in!");
            const modalEl = document.getElementById("authModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
        });
    }

    // Vendor Form Logic
    const vendorForm = document.getElementById("vendorForm");
    if(vendorForm) {
        vendorForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const phone = document.getElementById("vendorPhone").value;
            const address = document.getElementById("vendorAddress").value;

            const phoneRegex = /^03[0-9]{9}$/;
            if(!phoneRegex.test(phone)) {
                alert("Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567)");
                return;
            }

            if(address.length < 10) {
                alert("Address must be at least 10 characters long.");
                return;
            }

            sampleVendors.push({
                id: Date.now(),
                name: document.getElementById("vendorName").value,
                type: document.getElementById("vendorType").value,
                category: document.getElementById("vendorCategory").value,
                phone: phone,
                address: address,
                description: document.getElementById("vendorDescription").value,
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
            });

            renderVendors(sampleVendors);
            showToast("Vendor Added Successfully!");
            vendorForm.reset();
            const modalEl = document.getElementById("vendorModal");
            const modal = bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
        });
    }

    // Modal Triggers
    const openVendorModal = () => new bootstrap.Modal(document.getElementById("vendorModal")).show();
    const openAuthModal = () => new bootstrap.Modal(document.getElementById("authModal")).show();

    document.getElementById("openVendorBtn")?.addEventListener("click", openVendorModal);
    document.getElementById("openVendorBtn2")?.addEventListener("click", openVendorModal);
    document.getElementById("sideLoginBtn")?.addEventListener("click", openAuthModal);
    document.getElementById("profileLoginBtn")?.addEventListener("click", openAuthModal);

    // Sidebar Toggle for Mobile
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const sidebarClose = document.getElementById("sidebarClose");

    menuToggle?.addEventListener("click", () => sidebar?.classList.add("show"));
    sidebarClose?.addEventListener("click", () => sidebar?.classList.remove("show"));
}
