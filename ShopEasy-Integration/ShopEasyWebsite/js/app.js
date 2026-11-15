

/* ---------- 1. PRODUCT DATA ---------- */

const PRODUCTS = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        brand: "SoundMax",
        price: 1499,
        oldPrice: 1999,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
        description: "Enjoy clear sound and comfortable listening with these wireless headphones."
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        brand: "TimePro",
        price: 2499,
        oldPrice: 2999,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
        description: "A stylish smartwatch for everyday activities and notifications."
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        brand: "Active",
        price: 1999,
        oldPrice: 2499,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
        description: "Lightweight running shoes designed for everyday comfort."
    },
    {
        id: 4,
        name: "Handbag",
        category: "Fashion",
        brand: "Urban",
        price: 1299,
        oldPrice: 1599,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=700",
        description: "A versatile handbag with a simple and modern design."
    },
    {
        id: 5,
        name: "Sunglasses",
        category: "Accessories",
        brand: "SunStyle",
        price: 799,
        oldPrice: 999,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
        description: "Classic sunglasses for everyday outdoor use."
    },
    {
        id: 6,
        name: "Backpack",
        category: "Accessories",
        brand: "TravelGo",
        price: 999,
        oldPrice: 1299,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
        description: "A practical backpack for college, work and travel."
    },
    {
        id: 7,
        name: "Digital Camera",
        category: "Electronics",
        brand: "Pixel",
        price: 8999,
        oldPrice: 9999,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700",
        description: "Capture your favourite moments with this compact camera."
    },
    {
        id: 8,
        name: "Casual Sneakers",
        category: "Fashion",
        brand: "Active",
        price: 1799,
        oldPrice: 2199,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=700",
        description: "Comfortable casual sneakers for everyday wear."
    }
];


/* ---------- 2. STORAGE HELPERS ---------- */

function getData(key, defaultValue = []) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? defaultValue : JSON.parse(value);
    } catch (error) {
        return defaultValue;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUser() {
    return getData("loggedInUser", null);
}

function getCart() {
    return getData("cart", []);
}

function getWishlist() {
    return getData("wishlist", []);
}

function getOrders() {
    return getData("orders", []);
}

function getReviews() {
    return getData("reviews", []);
}

function getProduct(id) {
    return PRODUCTS.find(product => product.id === Number(id));
}

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getCartCount() {
    return getCart().reduce((total, item) => total + item.qty, 0);
}

function getCartTotal() {
    return getCart().reduce((total, item) => {
        const product = getProduct(item.id);
        return total + (product ? product.price * item.qty : 0);
    }, 0);
}


/* ---------- 3. COMMON PAGE ELEMENTS ---------- */

const app = document.getElementById("app");
const currentPage = document.body.dataset.page;

function requireLogin() {
    if (!getUser()) {
        location.href = "login.html";
        return false;
    }

    return true;
}

function renderHeader() {
    const user = getUser();

    return `
        <header class="site-header">
            <div class="container header-inner">

                <a href="index.html" class="logo">
                    Shop<span>Easy</span>
                </a>

                <nav class="nav-links">
                    <a href="index.html">Home</a>
                    <a href="products.html">Products</a>
                    <a href="wishlist.html">Wishlist (${getWishlist().length})</a>
                    <a href="cart.html">Cart (${getCartCount()})</a>
                    <a href="orders.html">Orders</a>
                    <a href="profile.html">Profile</a>
                </nav>

                <div class="header-actions">
                    ${
                        user
                        ? `
                            <span class="text-muted">
                                Hi, ${escapeHTML(user.name)}
                            </span>
                            <button class="btn btn-outline"
                                data-action="logout">
                                Logout
                            </button>
                        `
                        : `
                            <a class="btn btn-primary" href="login.html">
                                Login
                            </a>
                        `
                    }
                </div>

            </div>
        </header>
    `;
}

function renderFooter() {
    return `
        <footer class="site-footer">
            <div class="container">

                <div class="footer-grid">

                    <div>
                        <h3>ShopEasy</h3>
                        <p>
                            Discover useful products, great prices
                            and simple online shopping.
                        </p>
                    </div>

                    <div>
                        <h3>Quick Links</h3>
                        <div class="footer-links">
                            <a href="index.html">Home</a>
                            <a href="products.html">Products</a>
                            <a href="orders.html">My Orders</a>
                        </div>
                    </div>

                    <div>
                        <h3>Customer Support</h3>
                        <div class="footer-links">
                            <a href="profile.html">My Account</a>
                            <a href="tracking.html">Track Order</a>
                            <a href="reviews.html">Reviews</a>
                        </div>
                    </div>

                </div>

                <div class="footer-bottom">
                    © 2026 ShopEasy. All rights reserved.
                </div>

            </div>
        </footer>
    `;
}

function renderLayout(content) {
    app.innerHTML = `
        ${renderHeader()}
        <main class="container">
            ${content}
        </main>
        ${renderFooter()}
    `;

    attachCommonEvents();
}
function attachCommonEvents() {
    document.querySelectorAll('[data-action="logout"]').forEach(button => {
        button.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            location.href = "role-selection.html";
        });
    });

    document.querySelectorAll('[data-action="add"]').forEach(button => {
        button.addEventListener("click", () => {
            addToCart(Number(button.dataset.id));
        });
    });

    document.querySelectorAll('[data-action="wish"]').forEach(button => {
        button.addEventListener("click", () => {
            toggleWishlist(Number(button.dataset.id));
        });
    });
}


/* ---------- 4. PRODUCT CARD ---------- */

function productCard(product) {
    const wished = getWishlist().includes(product.id);

    return `
        <article class="product-card">

            <div class="product-image">
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}"
                         alt="${escapeHTML(product.name)}"
                         loading="lazy">
                </a>

                <button class="wishlist-btn"
                    data-action="wish"
                    data-id="${product.id}"
                    aria-label="Add to wishlist">
                    ${wished ? "♥" : "♡"}
                </button>
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3>
                    <a href="product.html?id=${product.id}">
                        ${escapeHTML(product.name)}
                    </a>
                </h3>

                <div class="product-rating">
                    ★★★★★
                    <span class="text-muted">
                        (${product.rating})
                    </span>
                </div>

                <div class="product-price">
                    ${formatPrice(product.price)}
                    <span class="product-old-price">
                        ${formatPrice(product.oldPrice)}
                    </span>
                </div>

                <div class="product-actions">

                    <button class="btn btn-primary"
                        data-action="add"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                    <a class="btn btn-outline"
                        href="product.html?id=${product.id}">
                        View
                    </a>

                </div>

            </div>

        </article>
    `;
}


/* ---------- 5. CART FUNCTIONALITY ---------- */

function addToCart(id) {
    if (!requireLogin()) return;

    const product = getProduct(id);
    if (!product) return;

    let cart = getCart();

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }

    saveData("cart", cart);

    alert(product.name + " added to your cart!");

    location.reload();
}

function removeFromCart(id) {
    const cart = getCart().filter(item => item.id !== id);
    saveData("cart", cart);
    renderCart();
}

function updateCartQuantity(id, change) {
    const cart = getCart();
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.qty += change;

    const updatedCart = cart.filter(product => product.qty > 0);

    saveData("cart", updatedCart);
    renderCart();
}


/* ---------- 6. WISHLIST FUNCTIONALITY ---------- */

function toggleWishlist(id) {
    if (!requireLogin()) return;

    let wishlist = getWishlist();

    if (wishlist.includes(id)) {
        wishlist = wishlist.filter(item => item !== id);
    } else {
        wishlist.push(id);
    }

    saveData("wishlist", wishlist);

    location.reload();
}


/* ---------- 7. LOGIN AND REGISTER ---------- */

function renderAuthPage(isRegister) {
    app.innerHTML = `
        <main class="container">

            <div class="form-container">

                <h1>
                    ${isRegister ? "Create Account" : "Welcome Back"}
                </h1>

                <p class="form-description">
                    ${
                        isRegister
                        ? "Register to start shopping with ShopEasy."
                        : "Login to continue shopping with ShopEasy."
                    }
                </p>

                <form id="auth-form">

                    ${
                        isRegister
                        ? `
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input class="form-control"
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="Enter your name">
                            </div>
                        `
                        : ""
                    }

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input class="form-control"
                            id="email"
                            type="email"
                            required
                            placeholder="Enter your email">
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input class="form-control"
                            id="password"
                            type="password"
                            minlength="6"
                            required
                            placeholder="Enter your password">
                    </div>
                                        ${
                        isRegister
                        ? `
                            <div class="form-group">
                                <label for="confirmPassword">
                                    Confirm Password
                                </label>

                                <input class="form-control"
                                    id="confirmPassword"
                                    type="password"
                                    minlength="6"
                                    required
                                    placeholder="Confirm your password">
                            </div>
                        `
                        : ""
                    }

                    <p id="auth-message"></p>

                    <button class="btn btn-primary btn-block"
                        type="submit">
                        ${isRegister ? "Create Account" : "Login"}
                    </button>

                </form>

                <p class="form-footer">
                    ${
                        isRegister
                        ? `Already have an account?
                           <a href="login.html">Login</a>`
                        : `Don't have an account?
                           <a href="register.html">Register</a>`
                    }
                </p>

                <p class="form-footer">
                    <a href="role-selection.html">Back to Role Selection</a>
                </p>

            </div>

        </main>
    `;

    document.getElementById("auth-form").addEventListener("submit", event => {
        event.preventDefault();

        const email = document.getElementById("email")
            .value.trim().toLowerCase();

        const password = document.getElementById("password").value;
        const message = document.getElementById("auth-message");

        let users = getData("users", []);

        if (isRegister) {
            const name = document.getElementById("name").value.trim();
            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                showMessage(message, "Passwords do not match.", "error");
                return;
            }

            if (users.some(user => user.email === email)) {
                showMessage(message, "Email is already registered.", "error");
                return;
            }

            users.push({
                name,
                email,
                password
            });

            saveData("users", users);

            showMessage(
                message,
                "Account created successfully! Redirecting to login...",
                "success"
            );

            setTimeout(() => {
                location.href = "login.html";
            }, 1200);

        } else {
            const foundUser = users.find(user =>
                user.email === email &&
                user.password === password
            );

            if (!foundUser) {
                showMessage(
                    message,
                    "Invalid email or password.",
                    "error"
                );
                return;
            }

            saveData("loggedInUser", {
                name: foundUser.name,
                email: foundUser.email
            });

            location.href = "products.html";
        }
    });
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = type === "success"
        ? "alert alert-success"
        : "alert alert-error";
}


/* ---------- 8. HOME PAGE ---------- */

function renderHome() {
    if (!requireLogin()) return;

    const categories = [
        {
            name: "Electronics",
            image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300"
        },
        {
            name: "Fashion",
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300"
        },
        {
            name: "Accessories",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
        },
        {
            name: "All Products",
            image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300"
        }
    ];

    renderLayout(`
        <section class="hero">

            <div class="hero-content">
                <span class="hero-tag">
                    Welcome to ShopEasy
                </span>

                <h1>
                    Shopping made
                    <span>simple.</span>
                </h1>

                <p>
                    Discover your favourite products at great prices.
                    Everything you need, all in one place.
                </p>

                <a href="products.html" class="btn btn-primary">
                    Explore Products →
                </a>
            </div>

            <div class="hero-image">
                <img
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=700"
                    alt="Shopping collection">
            </div>

        </section>

        <section class="section">

            <div class="section-header">
                <div>
                    <h2>Shop by Category</h2>
                    <p class="section-subtitle">
                        Find products from your favourite categories.
                    </p>
                </div>
            </div>

            <div class="category-grid">

                ${categories.map(category => `
                    <a class="category-card"
                       href="products.html${category.name === "All Products" ? "" : "?category=" + encodeURIComponent(category.name)}">

                        <img src="${category.image}"
                             alt="${escapeHTML(category.name)}">

                        <h3>${escapeHTML(category.name)}</h3>

                    </a>
                `).join("")}

            </div>

        </section>

        <section class="section">

            <div class="section-header">
                <div>
                    <h2>Featured Products</h2>
                    <p class="section-subtitle">
                        Popular picks selected for you.
                    </p>
                </div>

                <a href="products.html" class="btn btn-outline">
                    View All
                </a>
            </div>

            <div class="product-grid">
                ${PRODUCTS.slice(0, 4).map(productCard).join("")}
            </div>

        </section>

        <section class="section card">
            <h2>Special Shopping Experience</h2>

            <p class="text-muted">
                Browse our collection, save your favourites
                and enjoy a simple checkout experience.
            </p>

            <a href="products.html" class="btn btn-primary mt-2">
                Start Shopping
            </a>
        </section>
    `);
}


/* ---------- 9. PRODUCTS PAGE ---------- */

function renderProducts() {
    if (!requireLogin()) return;

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">All Products</h1>
                <p class="section-subtitle">
                    Search, filter and sort our collection.
                </p>
            </div>
        </div>

        <section class="section">

            <div class="filter-layout">

                <aside class="filter-panel">

                    <h3>Filters</h3>

                    <div class="filter-group">
                        <h3>Category</h3>

                        <select id="categoryFilter" class="form-control">
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <h3>Brand</h3>

                        <select id="brandFilter" class="form-control">
                            <option value="">All Brands</option>
                            ${[...new Set(PRODUCTS.map(p => p.brand))]
                                .map(brand => `
                                    <option value="${escapeHTML(brand)}">
                                        ${escapeHTML(brand)}
                                    </option>
                                `).join("")}
                        </select>
                    </div>

                    <div class="filter-group">
                        <h3>Maximum Price</h3>

                        <input id="priceFilter"
                            type="range"
                            min="500"
                            max="10000"
                            step="500"
                            value="10000">

                        <p class="text-muted">
                            Up to <span id="priceValue">₹10,000</span>
                        </p>
                    </div>

                    <button id="clearFilters"
                        class="btn btn-outline btn-block">
                        Clear Filters
                    </button>

                </aside>

                <div>

                    <div class="section-header">

                        <div class="search-bar">
                            <input id="searchInput"
                                type="search"
                                placeholder="Search products or brands...">
                        </div>

                        <select id="sortFilter" class="sort-select">
                            <option value="default">Featured</option>
                            <option value="low">Price: Low to High</option>
                            <option value="high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>

                    </div>

                    <p id="productCount" class="section-subtitle mb-2"></p>

                    <div id="productResults" class="product-grid"></div>

                </div>

            </div>

        </section>
    `);

    const category = document.getElementById("categoryFilter");
    const brand = document.getElementById("brandFilter");
    const price = document.getElementById("priceFilter");
    const search = document.getElementById("searchInput");
    const sort = document.getElementById("sortFilter");

    const params = new URLSearchParams(location.search);
    category.value = params.get("category") || "";

    function updateProducts() {
        const query = search.value.trim().toLowerCase();
        const maxPrice = Number(price.value);

        document.getElementById("priceValue").textContent =
            formatPrice(maxPrice);

        let filtered = PRODUCTS.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(query) ||
                product.brand.toLowerCase().includes(query);

            const matchesCategory =
                !category.value || product.category === category.value;

            const matchesBrand =
                !brand.value || product.brand === brand.value;

            const matchesPrice = product.price <= maxPrice;

            return matchesSearch &&
                matchesCategory &&
                matchesBrand &&
                matchesPrice;
        });

        if (sort.value === "low") {
            filtered.sort((a, b) => a.price - b.price);
        }

        if (sort.value === "high") {
            filtered.sort((a, b) => b.price - a.price);
        }

        if (sort.value === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        document.getElementById("productCount").textContent =
            `${filtered.length} product(s) found`;

        document.getElementById("productResults").innerHTML =
            filtered.length
                ? filtered.map(productCard).join("")
                : `
                    <div class="empty-state">
                        <h2>No products found</h2>
                        <p>Try changing your search or filters.</p>
                    </div>
                `;

        attachCommonEvents();
    }

    [category, brand, price, search, sort].forEach(control => {
        control.addEventListener("input", updateProducts);
        control.addEventListener("change", updateProducts);
    });

    document.getElementById("clearFilters").addEventListener("click", () => {
        category.value = "";
        brand.value = "";
        price.value = 10000;
        search.value = "";
        sort.value = "default";
        updateProducts();
    });

    updateProducts();
}


/* ---------- 10. PRODUCT DETAILS ---------- */

function renderProduct() {
    if (!requireLogin()) return;

    const params = new URLSearchParams(location.search);
    const product = getProduct(params.get("id"));

    if (!product) {
        renderLayout(`
            <div class="empty-state">
                <h2>Product not found</h2>
                <a href="products.html" class="btn btn-primary">
                    Back to Products
                </a>
            </div>
        `);
        return;
    }

    renderLayout(`
        <section class="product-detail">

            <div class="product-detail-image">
                <img src="${product.image}"
                    alt="${escapeHTML(product.name)}">
            </div>

            <div class="product-detail-info">

                <span class="badge">
                    ${escapeHTML(product.category)}
                </span>

                <h1>${escapeHTML(product.name)}</h1>

                <div class="product-rating">
                    ★★★★★ (${product.rating})
                </div>
                                <div class="detail-price">
                    ${formatPrice(product.price)}
                    <span class="product-old-price">
                        ${formatPrice(product.oldPrice)}
                    </span>
                </div>

                <p>${escapeHTML(product.description)}</p>

                <p>
                    <b>Brand:</b>
                    ${escapeHTML(product.brand)}
                </p>

                <p>
                    <span class="badge badge-success">
                        In Stock
                    </span>
                </p>

                <div class="product-actions mt-3">

                    <button class="btn btn-primary"
                        data-action="add"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                    <button class="btn btn-secondary"
                        data-action="wish"
                        data-id="${product.id}">
                        ♡ Wishlist
                    </button>

                </div>

                <p class="text-muted mt-3">
                    Easy shopping. Simple checkout.
                </p>

            </div>

        </section>
    `);
}


/* ---------- 11. WISHLIST PAGE ---------- */

function renderWishlist() {
    if (!requireLogin()) return;

    const products = getWishlist()
        .map(getProduct)
        .filter(Boolean);

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">My Wishlist</h1>
                <p class="section-subtitle">
                    Your favourite products saved in one place.
                </p>
            </div>
        </div>

        ${
            products.length
            ? `
                <div class="product-grid">
                    ${products.map(productCard).join("")}
                </div>
            `
            : `
                <div class="empty-state">
                    <h2>Your wishlist is empty</h2>
                    <p>Save products you love and find them here.</p>

                    <a href="products.html" class="btn btn-primary">
                        Explore Products
                    </a>
                </div>
            `
        }
    `);
}


/* ---------- 12. CART PAGE ---------- */

function renderCart() {
    if (!requireLogin()) return;

    const cart = getCart();
    const total = getCartTotal();

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">Shopping Cart</h1>
                <p class="section-subtitle">
                    Review your items before checkout.
                </p>
            </div>
        </div>

        ${
            cart.length
            ? `
                <div class="cart-layout">

                    <section class="card">

                        ${cart.map(item => {
                            const product = getProduct(item.id);
                            if (!product) return "";

                            return `
                                <div class="cart-item">

                                    <img src="${product.image}"
                                        alt="${escapeHTML(product.name)}">

                                    <div>
                                        <h3>${escapeHTML(product.name)}</h3>

                                        <p class="text-muted">
                                            ${formatPrice(product.price)}
                                        </p>

                                        <div class="quantity-control">

                                            <button
                                                data-quantity="${product.id}"
                                                data-change="-1">−</button>

                                            <span>${item.qty}</span>

                                            <button
                                                data-quantity="${product.id}"
                                                data-change="1">+</button>

                                        </div>
                                    </div>

                                    <div>
                                        <b>
                                            ${formatPrice(product.price * item.qty)}
                                        </b>

                                        <button class="btn btn-outline mt-1"
                                            data-remove="${product.id}">
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            `;
                        }).join("")}

                    </section>

                    <aside class="summary-card">

                        <h2>Order Summary</h2>

                        <div class="summary-row">
                            <span>Subtotal</span>
                            <span>${formatPrice(total)}</span>
                        </div>

                        <div class="summary-row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>

                        <div class="summary-row summary-total">
                            <span>Total</span>
                            <span>${formatPrice(total)}</span>
                        </div>

                        <a href="checkout.html"
                            class="btn btn-primary btn-block mt-2">
                            Proceed to Checkout
                        </a>

                        <a href="products.html"
                            class="btn btn-outline btn-block mt-1">
                            Continue Shopping
                        </a>

                    </aside>

                </div>
            `
            : `
                <div class="empty-state">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started.</p>

                    <a href="products.html" class="btn btn-primary">
                        Start Shopping
                    </a>
                </div>
            `
        }
    `);

    document.querySelectorAll("[data-quantity]").forEach(button => {
        button.addEventListener("click", () => {
            updateCartQuantity(
                Number(button.dataset.quantity),
                Number(button.dataset.change)
            );
        });
    });

    document.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => {
            removeFromCart(Number(button.dataset.remove));
        });
    });
}


/* ---------- 13. CHECKOUT PAGE ---------- */

function renderCheckout() {
    if (!requireLogin()) return;

    const cart = getCart();
    const total = getCartTotal();
    const user = getUser();

    if (!cart.length) {
        renderLayout(`
            <div class="empty-state">
                <h2>Your cart is empty</h2>
                <p>Add products before proceeding to checkout.</p>
                <a href="products.html" class="btn btn-primary">
                    Shop Now
                </a>
            </div>
        `);
        return;
    }

    renderLayout(`
        <div class="page-heading">
            <h1 class="page-title">Checkout</h1>
        </div>

        <div class="checkout-layout">

            <form id="checkoutForm" class="card">

                <h2>Delivery Details</h2>

                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input class="form-control"
                        id="fullName"
                        value="${escapeHTML(user.name)}"
                        required>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input class="form-control"
                        id="email"
                        type="email"
                        value="${escapeHTML(user.email)}"
                        required>
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input class="form-control"
                        id="phone"
                        type="tel"
                        pattern="[0-9]{10}"
                        maxlength="10"
                        placeholder="Enter 10-digit mobile number"
                        required>
                </div>

                <div class="form-group">
                    <label for="address">Delivery Address</label>
                    <textarea class="form-control"
                        id="address"
                        rows="4"
                        placeholder="House number, street, city and PIN code"
                        required></textarea>
                </div>

                <h2 class="mt-3">Payment Method</h2>

                <label class="payment-option">
                    <input type="radio"
                        name="payment"
                        value="COD"
                        checked>
                    <span>
                        <b>Cash on Delivery</b>
                        <br>
                        <span class="text-muted">
                            Pay when your order arrives.
                        </span>
                    </span>
                </label>

                <label class="payment-option">
                    <input type="radio"
                        name="payment"
                        value="UPI">
                    <span>
                        <b>Online Payment (UPI QR)</b>
                        <br>
                        <span class="text-muted">
                            Scan the demo UPI payment request.
                        </span>
                    </span>
                </label>

                <div id="qrContainer" class="qr-container"
                    style="display:none">

                    <h3>Scan to Pay</h3>

                    <div id="qrCode"></div>

                    <p>
                        Amount:
                        <b>${formatPrice(total)}</b>
                    </p>

                    <p class="text-muted">
                        Demo only. This QR does not verify or collect
                        an actual payment.
                    </p>

                    <label>
                        <input type="checkbox" id="paymentDemo">
                        I understand this is a demo payment.
                    </label>

                </div>

                <p id="checkoutMessage"></p>

                <button class="btn btn-primary btn-block mt-2"
                    type="submit">
                    Place Order
                </button>

            </form>

            <aside class="summary-card">

                <h2>Your Order</h2>

                ${cart.map(item => {
                    const product = getProduct(item.id);

                    return `
                        <div class="summary-row">
                            <span>
                                ${escapeHTML(product.name)} × ${item.qty}
                            </span>
                            <b>
                                ${formatPrice(product.price * item.qty)}
                            </b>
                        </div>
                    `;
                }).join("")}

                <div class="summary-row">
                    <span>Delivery</span>
                    <span>Free</span>
                </div>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <span>${formatPrice(total)}</span>
                </div>

            </aside>

        </div>
    `);

    const paymentOptions =
        document.querySelectorAll('input[name="payment"]');

    paymentOptions.forEach(option => {
        option.addEventListener("change", () => {
            const isUPI = document.querySelector(
                'input[name="payment"]:checked'
            ).value === "UPI";

            const qrContainer = document.getElementById("qrContainer");

            qrContainer.style.display = isUPI ? "block" : "none";

            if (isUPI) {
                generateQR(total);
            }
        });
    });

    document.getElementById("checkoutForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const payment = document.querySelector(
                'input[name="payment"]:checked'
            ).value;

            if (
                payment === "UPI" &&
                !document.getElementById("paymentDemo").checked
            ) {
                showMessage(
                    document.getElementById("checkoutMessage"),
                    "Please confirm the demo payment notice.",
                    "error"
                );
                return;
            }

            const order = {
                id: "SE" + Date.now(),
                name: document.getElementById("fullName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                address: document.getElementById("address").value.trim(),
                payment,
                total,
                items: cart,
                status: "Order Placed",
                date: new Date().toLocaleString()
            };

            const orders = getOrders();

            orders.unshift(order);

            saveData("orders", orders);
            saveData("lastOrder", order);
            saveData("cart", []);

            location.href = "success.html";
        });
}

function generateQR(total) {
    const qrBox = document.getElementById("qrCode");

    qrBox.innerHTML = "";

    // Replace this example UPI ID with your own only if
    // you intend to create a real payment request.
    const upiId = "example@upi";

    const upiLink =
        `upi://pay?pa=${encodeURIComponent(upiId)}` +
        `&pn=ShopEasy` +
        `&am=${total.toFixed(2)}` +
        `&cu=INR` +
        `&tn=ShopEasy%20Demo%20Order`;

    if (window.QRCode) {
        new QRCode(qrBox, {
            text: upiLink,
            width: 180,
            height: 180
        });
    } else {
        qrBox.textContent = "QR code library could not be loaded.";
    }
    }


/* ---------- 14. ORDER SUCCESS PAGE ---------- */

function renderSuccess() {
    if (!requireLogin()) return;

    const order = getData("lastOrder", null);

    renderLayout(`
        <div class="empty-state">

            <h1>Thank You for Your Order!</h1>

            <p>
                Your demo order has been placed successfully.
            </p>

            ${
                order
                ? `
                    <div class="card mt-3">
                        <p>
                            <b>Order ID:</b>
                            ${escapeHTML(order.id)}
                        </p>

                        <p>
                            <b>Total:</b>
                            ${formatPrice(order.total)}
                        </p>

                        <p>
                            <b>Payment:</b>
                            ${escapeHTML(order.payment)}
                        </p>
                    </div>
                `
                : ""
            }

            <a href="orders.html" class="btn btn-primary mt-2">
                View My Orders
            </a>

            <a href="products.html" class="btn btn-outline mt-2">
                Continue Shopping
            </a>

        </div>
    `);
}


/* ---------- 15. ORDER HISTORY PAGE ---------- */

function renderOrders() {
    if (!requireLogin()) return;

    const orders = getOrders();

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">My Orders</h1>
                <p class="section-subtitle">
                    View your previous purchases.
                </p>
            </div>
        </div>

        ${
            orders.length
            ? `
                <div class="section">

                    ${orders.map(order => `
                        <article class="card mb-2">

                            <div class="flex-between">

                                <div>
                                    <h3>
                                        Order ${escapeHTML(order.id)}
                                    </h3>

                                    <p class="text-muted">
                                        ${escapeHTML(order.date)}
                                    </p>
                                </div>

                                <span class="badge badge-success">
                                    ${escapeHTML(order.status)}
                                </span>

                            </div>

                            <divider></divider>

                            <p class="mt-2">
                                ${order.items.map(item => {
                                    const product = getProduct(item.id);

                                    return product
                                        ? `${escapeHTML(product.name)} × ${item.qty}`
                                        : "Product";
                                }).join(", ")}
                            </p>

                            <div class="flex-between mt-2">

                                <b>${formatPrice(order.total)}</b>

                                <div class="flex gap-1">
                                    <a class="btn btn-primary"
                                        href="tracking.html?id=${encodeURIComponent(order.id)}">
                                        Track Order
                                    </a>

                                    <a class="btn btn-outline"
                                        href="reviews.html">
                                        Write Review
                                    </a>
                                </div>

                            </div>

                        </article>
                    `).join("")}

                </div>
            `
            : `
                <div class="empty-state">
                    <h2>No orders yet</h2>
                    <p>Your orders will appear here after checkout.</p>

                    <a href="products.html" class="btn btn-primary">
                        Start Shopping
                    </a>
                </div>
            `
        }
    `);
}


/* ---------- 16. ORDER TRACKING PAGE ---------- */


/* ---------- 16. ORDER TRACKING PAGE ---------- */

function renderTracking() {
    if (!requireLogin()) return;

    const params = new URLSearchParams(location.search);
    const orderId = params.get("id");

    const orders = getOrders();

    const order = orderId
        ? orders.find(item => item.id === orderId)
        : orders[0];

    const trackingSteps = [
        "Order Placed",
        "Processing",
        "Shipped",
        "Delivered"
    ];

    const currentStatus = order
        ? order.status
        : "";

    const currentStep = trackingSteps.indexOf(currentStatus);

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">Track Your Order</h1>
                <p class="section-subtitle">
                    Check your order details and demo status.
                </p>
            </div>
        </div>

        ${
            order
            ? `
                <section class="card">

                    <h2>Order ${escapeHTML(order.id)}</h2>

                    <p class="text-muted">
                        Placed on ${escapeHTML(order.date)}
                    </p>

                    <p class="mt-2">
                        Current Status:
                        <span class="badge badge-success">
                            ${escapeHTML(currentStatus)}
                        </span>
                    </p>

                    <div class="tracking-steps">

                        ${trackingSteps.map((step, index) => {

                            const isCompleted = index <= currentStep;

                            return `
                                <div class="tracking-step ${
                                    isCompleted ? "completed" : ""
                                }">

                                    <div class="step-icon">
                                        ${isCompleted ? "✓" : index + 1}
                                    </div>

                                    <p>${step}</p>

                                </div>
                            `;

                        }).join("")}

                    </div>

                    <p class="text-muted">
                        This is a frontend demonstration.
                        Actual shipment updates require a delivery
                        service integration.
                    </p>

                    <a href="orders.html"
                        class="btn btn-outline mt-2">
                        Back to Orders
                    </a>

                </section>
            `
            : `
                <div class="empty-state">
                    <h2>No order found</h2>
                    <p>Place an order to use order tracking.</p>

                    <a href="products.html" class="btn btn-primary">
                        Browse Products
                    </a>
                </div>
            `
        }
    `);
}


/* ---------- 17. REVIEWS PAGE ---------- */
function renderReviews() {
    if (!requireLogin()) return;

    const reviews = getReviews();

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">Reviews & Ratings</h1>
                <p class="section-subtitle">
                    Share your experience with our products.
                </p>
            </div>
        </div>

        <div class="checkout-layout">

            <form class="card" id="reviewForm">

                <h2>Write a Review</h2>

                <div class="form-group">
                    <label for="reviewProduct">Select Product</label>

                    <select id="reviewProduct" class="form-control">
                        ${PRODUCTS.map(product => `
                            <option value="${product.id}">
                                ${escapeHTML(product.name)}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div class="form-group">
                    <label for="reviewRating">Your Rating</label>

                    <select id="reviewRating" class="form-control">
                        <option value="5">★★★★★ - Excellent</option>
                        <option value="4">★★★★ - Very Good</option>
                        <option value="3">★★★ - Good</option>
                        <option value="2">★★ - Fair</option>
                        <option value="1">★ - Poor</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="reviewComment">Your Feedback</label>

                    <textarea id="reviewComment"
                        class="form-control"
                        rows="5"
                        required
                        placeholder="Write your experience..."></textarea>
                </div>

                <p id="reviewMessage"></p>

                <button class="btn btn-primary btn-block">
                    Submit Review
                </button>

            </form>

            <section>

                <h2 class="mb-2">Customer Reviews</h2>

                ${
                    reviews.length
                    ? reviews.map(review => `
                        <article class="review-card">

                            <h3>
                                ${escapeHTML(review.product)}
                            </h3>

                            <div class="review-stars">
                                ${"★".repeat(review.rating)}
                                ${"☆".repeat(5 - review.rating)}
                            </div>

                            <p>${escapeHTML(review.comment)}</p>

                            <p class="text-muted mt-1">
                                By ${escapeHTML(review.name)}
                            </p>

                        </article>
                    `).join("")
                    : `
                        <div class="empty-state">
                            <h2>No reviews yet</h2>
                            <p>Be the first to share your feedback.</p>
                        </div>
                    `
                }

            </section>

        </div>
    `);

    document.getElementById("reviewForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const product = getProduct(
                document.getElementById("reviewProduct").value
            );

            const review = {
                product: product.name,
                rating: Number(
                    document.getElementById("reviewRating").value
                ),
                comment: document.getElementById("reviewComment")
                    .value.trim(),
                name: getUser().name
            };

            if (!review.comment) return;

            const allReviews = getReviews();

            allReviews.unshift(review);

            saveData("reviews", allReviews);

            renderReviews();
        });
}


/* ---------- 18. PROFILE PAGE ---------- */

function renderProfile() {
    if (!requireLogin()) return;

    const user = getUser();

    renderLayout(`
        <div class="page-heading">
            <div>
                <h1 class="page-title">My Profile</h1>
                <p class="section-subtitle">
                    Manage your account information.
                </p>
            </div>
        </div>

        <div class="profile-layout">

            <aside class="profile-sidebar">

                <div class="profile-avatar">
                    ${escapeHTML(user.name.charAt(0).toUpperCase())}
                </div>

                <h3>${escapeHTML(user.name)}</h3>

                <p class="text-muted text-center">
                    ${escapeHTML(user.email)}
                </p>

                <div class="profile-menu">
                    <a href="profile.html" class="active">
                        My Profile
                    </a>

                    <a href="orders.html">
                        My Orders
                    </a>

                    <a href="wishlist.html">
                        My Wishlist
                    </a>

                    <a href="cart.html">
                        My Cart
                    </a>
                </div>

            </aside>

            <section class="card">

                <h2>Personal Information</h2>

                <form id="profileForm">

                    <div class="form-group">
                        <label for="profileName">Full Name</label>

                        <input id="profileName"
                            class="form-control"
                            value="${escapeHTML(user.name)}"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="profileEmail">Email Address</label>

                        <input id="profileEmail"
                            class="form-control"
                            type="email"
                            value="${escapeHTML(user.email)}"
                            disabled>
                    </div>

                    <p id="profileMessage"></p>

                    <button class="btn btn-primary">
                        Save Changes
                    </button>

                </form>

            </section>

        </div>
    `);

    document.getElementById("profileForm")
        .addEventListener("submit", event => {
            event.preventDefault();

            const newName = document.getElementById("profileName")
                .value.trim();

            if (!newName) return;

            const users = getData("users", []);

            const index = users.findIndex(
                item => item.email === user.email
            );

            if (index !== -1) {
                users[index].name = newName;
                saveData("users", users);
            }

            saveData("loggedInUser", {
                ...user,
                name: newName
            });

            showMessage(
                document.getElementById("profileMessage"),
                "Your profile has been updated.",
                "success"
            );
        });
}


/* ---------- 19. START THE WEBSITE ---------- */

function startShopEasy() {
    switch (currentPage) {

        case "login":
            renderAuthPage(false);
            break;

        case "register":
            renderAuthPage(true);
            break;

        case "home":
            renderHome();
            break;

        case "products":
            renderProducts();
            break;

        case "product":
            renderProduct();
            break;

        case "wishlist":
            renderWishlist();
            break;

        case "cart":
            renderCart();
            break;

        case "checkout":
            renderCheckout();
            break;

        case "success":
            renderSuccess();
            break;

        case "orders":
            renderOrders();
            break;

        case "tracking":
            renderTracking();
            break;

        case "reviews":
            renderReviews();
            break;

        case "profile":
            renderProfile();
            break;

        default:
            renderHome();
    }
}

/* ======================================
   ADMIN CUSTOMER DETAILS
====================================== */

// Escape values before inserting them into admin-page HTML.
function escapeAdminHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// This demo expects the admin login page to set:
// localStorage.setItem("adminLoggedIn", "true").
// If your admin login uses a different key, update it here.
function isAdminLoggedIn() {
    return localStorage.getItem("adminLoggedIn") === "true";
}

function loadCustomerDetails() {

    if (!location.pathname.endsWith("admin-customer-details.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    const customerId = new URLSearchParams(
        location.search
    ).get("id");

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const customer = users.find(user =>
        String(user.id ?? user.email) === String(customerId)
    );

    if (!customer) {

        document.getElementById("customerName").textContent =
            "Customer not found";

        document.getElementById("customerEmail").textContent =
            "This customer account could not be found.";

        document.getElementById("customerOrdersBody").innerHTML = `
            <tr>
                <td colspan="4" class="admin-empty-cell">
                    Customer information is unavailable.
                </td>
            </tr>
        `;

        return;
    }

    const name = customer.name || customer.fullName || "Customer";
    const email = customer.email || "Not provided";

    document.getElementById("customerName").textContent = name;
    document.getElementById("customerEmail").textContent = email;

    document.getElementById("customerAvatar").textContent =
        name.charAt(0).toUpperCase();

    document.getElementById("detailName").textContent = name;
    document.getElementById("detailEmail").textContent = email;

    document.getElementById("detailPhone").textContent =
        customer.phone || customer.phoneNumber || "Not provided";

    document.getElementById("detailDate").textContent =
        customer.createdAt
            ? new Date(customer.createdAt).toLocaleDateString("en-IN")
            : "Not available";

    document.getElementById("detailAddress").textContent =
        customer.address || "Not provided";

    // Match orders using the customer's email or ID.
    const customerOrders = orders.filter(order =>
        String(order.email || "").toLowerCase() ===
            String(email).toLowerCase() ||
        (
            customer.id != null &&
            String(order.userId) === String(customer.id)
        )
    );

    const totalSpending = customerOrders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    document.getElementById("customerOrderCount").textContent =
        customerOrders.length;

    document.getElementById("customerTotalSpending").textContent =
        "₹" + totalSpending.toLocaleString("en-IN");

    const tableBody =
        document.getElementById("customerOrdersBody");

    if (customerOrders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="admin-empty-cell">
                    This customer has not placed any orders yet.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = customerOrders.map(order => `
        <tr>
            <td>${escapeAdminHTML(order.id)}</td>

            <td>
                ₹${Number(order.total || 0).toLocaleString("en-IN")}
            </td>

            <td>${escapeAdminHTML(order.payment || "Not available")}</td>

            <td>
                <span class="admin-order-status">
                    ${escapeAdminHTML(order.status || "Pending")}
                </span>
            </td>
        </tr>
    `).join("");
}

if (location.pathname.endsWith("admin-customer-details.html")) {
    loadCustomerDetails();
} else {
    startShopEasy();
}