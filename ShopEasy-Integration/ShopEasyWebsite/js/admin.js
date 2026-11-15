
/* ======================================
   ADMIN CONFIGURATION
====================================== */

const ADMIN_EMAIL = "admin@shopeasy.com";
const ADMIN_PASSWORD = "Admin@123";

const PRODUCT_STORAGE_KEY = "shopEasyProducts";


/* ======================================
   DEFAULT PRODUCTS
====================================== */

const defaultProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        stock: 20,
        image: ""
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 2499,
        stock: 15,
        image: ""
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1999,
        stock: 25,
        image: ""
    },
    {
        id: 4,
        name: "Travel Backpack",
        category: "Accessories",
        price: 999,
        stock: 18,
        image: ""
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1299,
        stock: 12,
        image: ""
    },
    {
        id: 6,
        name: "Men's T-Shirt",
        category: "Fashion",
        price: 599,
        stock: 30,
        image: ""
    },
    {
        id: 7,
        name: "Water Bottle",
        category: "Accessories",
        price: 399,
        stock: 40,
        image: ""
    },
    {
        id: 8,
        name: "Laptop Stand",
        category: "Electronics",
        price: 799,
        stock: 10,
        image: ""
    }
];


/* ======================================
   PRODUCT STORAGE
====================================== */

function getProducts() {
    try {
        const savedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);

        if (savedProducts === null) {
            localStorage.setItem(
                PRODUCT_STORAGE_KEY,
                JSON.stringify(defaultProducts)
            );

            return [...defaultProducts];
        }

        const products = JSON.parse(savedProducts);

        return Array.isArray(products) ? products : [];

    } catch (error) {
        console.error("Unable to load products:", error);
        return [];
    }
}


function saveProducts(products) {
    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );
}


/* ======================================
   ADMIN LOGIN
====================================== */

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document
            .getElementById("adminEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("adminPassword")
            .value;

        const message = document.getElementById("adminLoginMessage");

        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "adminSession",
                JSON.stringify({
                    email: ADMIN_EMAIL,
                    role: "admin",
                    loggedIn: true
                })
            );

            message.textContent =
                "Login successful! Opening dashboard...";

            message.className = "admin-message-success";

            setTimeout(function () {
                location.href = "admin-dashboard.html";
            }, 800);

        } else {

            message.textContent =
                "Invalid admin email or password.";

            message.className = "admin-message-error";
        }
    });
}


/* ======================================
   ADMIN SESSION VALIDATION
====================================== */

function isAdminLoggedIn() {

    try {
        const session = JSON.parse(
            localStorage.getItem("adminSession") || "null"
        );

        return Boolean(
            session &&
            session.loggedIn === true &&
            session.role === "admin" &&
            session.email === ADMIN_EMAIL
        );

    } catch (error) {
        return false;
    }
}


const protectedAdminPages = [
    "admin-dashboard.html",
    "admin-products.html",
    "admin-orders.html",
    "admin-users.html",
    "admin-customer-details.html"
];

const currentFile = location.pathname.split("/").pop();

if (
    protectedAdminPages.includes(currentFile) &&
    !isAdminLoggedIn()
) {
    location.replace("admin-login.html");
}


/* ======================================
   ADMIN LOGOUT
====================================== */

function adminLogout() {

    localStorage.removeItem("adminSession");

    location.href = "admin-login.html";
}


/* ======================================
   HTML ESCAPE FUNCTION
====================================== */

function escapeAdminHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


/* ======================================
   ADMIN DASHBOARD DATA
====================================== */

function loadAdminDashboard() {

    if (!location.pathname.endsWith("admin-dashboard.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    const products = getProducts();

    const revenue = orders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    const revenueElement = document.getElementById("totalRevenue");
    const ordersElement = document.getElementById("totalOrders");
    const productsElement = document.getElementById("totalProducts");
    const customersElement = document.getElementById("totalCustomers");

    if (revenueElement) {
        revenueElement.textContent =
            "₹" + revenue.toLocaleString("en-IN");
    }

    if (ordersElement) {
        ordersElement.textContent = orders.length;
    }

    if (productsElement) {
        productsElement.textContent = products.length;
    }

    if (customersElement) {
        customersElement.textContent = users.length;
    }

    const tableBody = document.getElementById("recentOrdersBody");

    if (!tableBody) return;

    if (orders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="admin-empty-cell">
                    No orders have been placed yet.
                </td>
            </tr>
        `;

    } else {

        tableBody.innerHTML = orders.slice(0, 5).map(order => `
            <tr>
                <td>${escapeAdminHTML(order.id)}</td>
                <td>${escapeAdminHTML(order.name)}</td>
                <td>₹${Number(order.total || 0).toLocaleString("en-IN")}</td>
                <td>${escapeAdminHTML(order.payment || "Not available")}</td>
                <td>
                    <span class="admin-order-status">
                        ${escapeAdminHTML(order.status || "Order Placed")}
                    </span>
                </td>
            </tr>
        `).join("");
    }
}


/* ======================================
   ADMIN PRODUCT MANAGEMENT
====================================== */

function loadAdminProducts() {

    if (!location.pathname.endsWith("admin-products.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    const products = getProducts();

    const tableBody = document.getElementById("adminProductsBody");

    if (!tableBody) return;

    if (products.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="admin-empty-cell">
                    No products available. Add your first product.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = products.map(product => `

        <tr>

            <td>
                <div class="admin-product-info">

                    <img
                        src="${escapeAdminHTML(product.image || "assets/images/products/default.jpg")}"
                        alt="${escapeAdminHTML(product.name)}"
                        class="admin-product-image"
                        onerror="this.style.display='none'"
                    >

                    <span class="admin-product-name">
                        ${escapeAdminHTML(product.name)}
                    </span>

                </div>
            </td>

            <td>${escapeAdminHTML(product.category)}</td>

            <td>
                ₹${Number(product.price).toLocaleString("en-IN")}
            </td>

            <td>${Number(product.stock)}</td>

            <td>
                <div class="admin-product-actions">

                    <button
                        class="admin-edit-btn"
                        onclick="editProduct(${Number(product.id)})">
                        Edit
                    </button>

                    <button
                        class="admin-delete-btn"
                        onclick="deleteProduct(${Number(product.id)})">
                        Delete
                    </button>

                </div>
            </td>

        </tr>

    `).join("");
}


/* ======================================
   OPEN PRODUCT FORM
====================================== */

function openProductForm() {

    const formContainer =
        document.getElementById("productFormContainer");

    const form =
        document.getElementById("adminProductForm");

    const title =
        document.getElementById("productFormTitle");

    if (!formContainer || !form) return;

    form.reset();

    document.getElementById("productId").value = "";

    if (title) {
        title.textContent = "Add New Product";
    }

    formContainer.style.display = "block";

    document.getElementById("productFormMessage").textContent = "";

    formContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* ======================================
   CLOSE PRODUCT FORM
====================================== */

function closeProductForm() {

    const formContainer =
        document.getElementById("productFormContainer");

    const form =
        document.getElementById("adminProductForm");

    if (form) form.reset();

    if (formContainer) {
        formContainer.style.display = "none";
    }
}


/* ======================================
   ADD / UPDATE PRODUCT
====================================== */

const adminProductForm =
    document.getElementById("adminProductForm");

if (adminProductForm) {

    adminProductForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!isAdminLoggedIn()) return;

        const id = document.getElementById("productId").value;

        const name = document
            .getElementById("productName")
            .value.trim();

        const category = document
            .getElementById("productCategory")
            .value.trim();

        const price = Number(
            document.getElementById("productPrice").value
        );

        const stock = Number(
            document.getElementById("productStock").value
        );

        const image = document
            .getElementById("productImage")
            .value.trim();

        const message =
            document.getElementById("productFormMessage");

        if (
            !name ||
            !category ||
            !Number.isFinite(price) ||
            !Number.isInteger(stock) ||
            price <= 0 ||
            stock < 0
        ) {

            message.textContent = "Please enter valid product details.";

            message.style.color = "#d93636";

            return;
        }

        const products = getProducts();

        if (id) {

            const index = products.findIndex(
                product => Number(product.id) === Number(id)
            );

            if (index !== -1) {

                products[index] = {
                    ...products[index],
                    name,
                    category,
                    price,
                    stock,
                    image
                };
            }

            message.textContent = "Product updated successfully!";

        } else {

            const newProduct = {
                id: Date.now(),
                name,
                category,
                price,
                stock,
                image
            };

            products.push(newProduct);

            message.textContent = "Product added successfully!";
        }

        saveProducts(products);

        message.style.color = "#16834a";

        loadAdminProducts();

        setTimeout(function () {
            closeProductForm();
        }, 700);

    });
}


/* ======================================
   EDIT PRODUCT
====================================== */

function editProduct(productId) {

    if (!isAdminLoggedIn()) return;

    const products = getProducts();

    const product = products.find(
        item => Number(item.id) === Number(productId)
    );

    if (!product) return;

    openProductForm();

    document.getElementById("productId").value = product.id;

    document.getElementById("productName").value = product.name;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productStock").value =
        product.stock;

    document.getElementById("productImage").value =
        product.image || "";

    document.getElementById("productFormTitle").textContent =
        "Edit Product";
}


/* ======================================
   DELETE PRODUCT
====================================== */

function deleteProduct(productId) {

    if (!isAdminLoggedIn()) return;

    const confirmation = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmation) return;

    const products = getProducts();

    const updatedProducts = products.filter(
        product => Number(product.id) !== Number(productId)
    );

    saveProducts(updatedProducts);

    loadAdminProducts();

    alert("Product deleted successfully!");
}


/* ======================================
   ADMIN ORDER MANAGEMENT
====================================== */

function loadAdminOrders() {

    if (!location.pathname.endsWith("admin-orders.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    let orders = [];

    try {
        orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        if (!Array.isArray(orders)) {
            orders = [];
        }

    } catch (error) {
        console.error("Unable to read orders:", error);
    }

    const totalElement = document.getElementById("allOrdersCount");
    const pendingElement = document.getElementById("pendingOrdersCount");
    const deliveredElement = document.getElementById("deliveredOrdersCount");
    const tableBody = document.getElementById("adminOrdersBody");

    if (!tableBody) return;

    const pendingOrders = orders.filter(order =>
        ["Order Placed", "Pending", "Processing"].includes(order.status)
    );

    const deliveredOrders = orders.filter(order =>
        order.status === "Delivered"
    );

    if (totalElement) {
        totalElement.textContent = orders.length;
    }

    if (pendingElement) {
        pendingElement.textContent = pendingOrders.length;
    }

    if (deliveredElement) {
        deliveredElement.textContent = deliveredOrders.length;
    }

    if (orders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="admin-empty-cell">
                    No orders have been placed yet.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = orders.map((order, index) => {

        const status = order.status || "Order Placed";

        return `
            <tr>

                <td>${escapeAdminHTML(order.id)}</td>

                <td>
                    <strong>${escapeAdminHTML(order.name)}</strong>
                    <br>
                    <small>${escapeAdminHTML(order.email)}</small>
                </td>

                <td>
                    ₹${Number(order.total || 0).toLocaleString("en-IN")}
                </td>

                <td>${escapeAdminHTML(order.payment || "Not available")}</td>

                <td>
                    <span class="admin-order-status">
                        ${escapeAdminHTML(status)}
                    </span>
                </td>

                <td>
                    <select
                        class="admin-order-status-select"
                        onchange="updateAdminOrderStatus(${index}, this.value)"
                    >
                        ${["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"]
                            .map(item => `
                                <option
                                    value="${item}"
                                    ${status === item ? "selected" : ""}
                                >
                                    ${item}
                                </option>
                            `).join("")}
                    </select>
                </td>

            </tr>
        `;
    }).join("");
}


/* ======================================
   UPDATE ORDER STATUS
====================================== */

function updateAdminOrderStatus(index, newStatus) {

    let orders = [];

    try {
        orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        if (!Array.isArray(orders)) return;

    } catch (error) {
        console.error("Unable to update order:", error);
        return;
    }

    if (!orders[index]) return;

    orders[index].status = newStatus;

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order status updated successfully!");

    loadAdminOrders();
}


/* ======================================
   ADMIN CUSTOMER DETAILS
====================================== */

function loadCustomerDetails() {

    if (!location.pathname.endsWith("admin-customer-details.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    const params = new URLSearchParams(location.search);
    const customerId = params.get("id");

    const users = JSON.parse(
        localStorage.getItem("users") || "[]"
    );

    const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    const customer = users.find(user =>
        String(user.id) === String(customerId) ||
        user.email === customerId
    );

    if (!customer) {
        const nameElement = document.getElementById("customerName");

        if (nameElement) {
            nameElement.textContent = "Customer not found";
        }

        return;
    }

    const customerOrders = orders.filter(order =>
        order.email === customer.email
    );

    const totalSpending = customerOrders.reduce(
        (total, order) => total + Number(order.total || 0),
        0
    );

    const setText = (id, value) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value ?? "Not available";
        }
    };

    setText("customerName", customer.name);
    setText("customerEmail", customer.email);
    setText("customerPhone", customer.phone);
    setText("customerAddress", customer.address);
    setText("customerRegistrationDate", customer.date || "Not available");

    setText("customerTotalOrders", customerOrders.length);

    setText(
        "customerTotalSpending",
        "₹" + totalSpending.toLocaleString("en-IN")
    );

    const tableBody = document.getElementById("customerOrdersBody");

    if (!tableBody) return;

    if (customerOrders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="admin-empty-cell">
                    This customer has not placed any orders.
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = customerOrders.map(order => `
        <tr>
            <td>${escapeAdminHTML(order.id)}</td>
            <td>${escapeAdminHTML(order.date)}</td>
            <td>₹${Number(order.total || 0).toLocaleString("en-IN")}</td>
            <td>${escapeAdminHTML(order.payment || "Not available")}</td>
            <td>${escapeAdminHTML(order.status || "Order Placed")}</td>
        </tr>
    `).join("");
}

/* ======================================
   ADMIN CUSTOMER MANAGEMENT
====================================== */

function loadAdminUsers() {

    if (!location.pathname.endsWith("admin-users.html")) {
        return;
    }

    if (!isAdminLoggedIn()) return;

    let users = [];

    try {
        users = JSON.parse(
            localStorage.getItem("users") || "[]"
        );

        if (!Array.isArray(users)) {
            users = [];
        }

    } catch (error) {
        console.error("Unable to load customers:", error);
    }

    const totalElement =
        document.getElementById("adminTotalCustomers");

    const registeredElement =
        document.getElementById("adminRegisteredCustomers");

    const tableBody =
        document.getElementById("adminUsersBody");

    const searchInput =
        document.getElementById("customerSearch");

    if (totalElement) {
        totalElement.textContent = users.length;
    }

    if (registeredElement) {
        registeredElement.textContent = users.length;
    }

    function displayCustomers(searchText = "") {

        if (!tableBody) return;

        const filteredUsers = users.filter(user => {

            const name = (user.name || "").toLowerCase();
            const email = (user.email || "").toLowerCase();

            return name.includes(searchText) ||
                   email.includes(searchText);
        });

        if (filteredUsers.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-empty-cell">
                        No customers found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML = filteredUsers.map(user => {

            const customerId = user.id || user.email;

            return `
                <tr>
                    <td>${escapeAdminHTML(user.name || "Customer")}</td>

                    <td>${escapeAdminHTML(user.email || "Not available")}</td>

                    <td>${escapeAdminHTML(user.phone || "Not provided")}</td>

                    <td>
                        <span class="admin-order-status">
                            Registered
                        </span>
                    </td>

                    <td>
                        <a class="admin-edit-btn"
                           href="admin-customer-details.html?id=${encodeURIComponent(customerId)}">
                            View Details
                        </a>
                    </td>
                </tr>
            `;

        }).join("");
    }

    displayCustomers();

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            displayCustomers(this.value.trim().toLowerCase());
        });
    }
}


/* ======================================
   LOAD PAGE DATA
====================================== */

loadAdminDashboard();

loadAdminProducts();

loadAdminOrders();

loadAdminUsers();


loadCustomerDetails();