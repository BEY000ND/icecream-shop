/* ==========================================
   Ice Cream Shop - Main JavaScript
   ========================================== */

// ==========================================
// Product Data
// ==========================================
const products = [
    { id: 1, name: 'Ванильное', price: 100, image: 'images/vanila.jpg' },
    { id: 2, name: 'Шоколадное', price: 100, image: 'images/chocolate.jpg' },
    { id: 3, name: 'Клубничное', price: 100, image: 'images/strawberry.jpg' },
    { id: 4, name: 'Мятное', price: 100, image: 'images/mint.jpg' },
    { id: 5, name: 'Карамельное', price: 100, image: 'images/caramel.jpg' }
];

// ==========================================
// Burger Menu Functionality
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');

    if (burgerMenu && mobileNav) {
        // Toggle mobile menu
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!burgerMenu.contains(event.target) && !mobileNav.contains(event.target)) {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }

    // ==========================================
    // Form Validation
    // ==========================================
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // ==========================================
    // Catalog & Cart Functionality
    // ==========================================
    initCatalog();
    
    // ==========================================
    // Payment Page
    // ==========================================
    initPaymentPage();
});

// ==========================================
// Registration Handler
// ==========================================
function handleRegistration(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // Validate name
    if (name.length < 2) {
        showError('name', 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }

    // Validate email
    if (!isValidEmail(email)) {
        showError('email', 'Введите корректный email');
        isValid = false;
    }

    // Validate password
    if (password.length < 6) {
        showError('password', 'Пароль должен содержать минимум 6 символов');
        isValid = false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        showError('confirm-password', 'Пароли не совпадают');
        isValid = false;
    }

    if (isValid) {
        // Simulate successful registration
        alert('Регистрация прошла успешно! Теперь вы можете войти.');
        window.location.href = 'login.html';
    }
}

// ==========================================
// Login Handler
// ==========================================
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // Validate email
    if (!isValidEmail(email)) {
        showError('email', 'Введите корректный email');
        isValid = false;
    }

    // Validate password
    if (password.length === 0) {
        showError('password', 'Введите пароль');
        isValid = false;
    }

    if (isValid) {
        // Simulate successful login (accepts any credentials)
        window.location.href = 'catalog.html';
    }
}

// ==========================================
// Validation Helpers
// ==========================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.error');
    
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.classList.remove('visible');
    });
    
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// ==========================================
// Cart Functions
// ==========================================
function getCart() {
    const savedCart = sessionStorage.getItem('iceCreamCart');
    return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
    sessionStorage.setItem('iceCreamCart', JSON.stringify(cart));
}

function addToCart(productId) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartDisplay();
}

function removeFromCart(productId) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    saveCart(cart);
    updateCartDisplay();
}

function clearCart() {
    sessionStorage.removeItem('iceCreamCart');
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.querySelector('.cart-total-price');
    const cartDropZone = document.querySelector('.cart-drop-zone');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        if (cartTotalPrice) cartTotalPrice.textContent = '0 ₽';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (cartDropZone) cartDropZone.style.display = 'block';
    } else {
        if (cartDropZone) cartDropZone.style.display = 'none';
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">${item.price * item.quantity} ₽</span>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)" title="Уменьшить">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)" title="Увеличить">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Удалить">×</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalPrice) cartTotalPrice.textContent = `${total} ₽`;
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
}

function changeQuantity(productId, delta) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    saveCart(cart);
    updateCartDisplay();
}

// ==========================================
// Catalog Initialization
// ==========================================
function initCatalog() {
    const productsGrid = document.querySelector('.products-grid');
    const cartDropZone = document.querySelector('.cart-drop-zone');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!productsGrid) return;

    // Render products
    renderProducts();

    // Update cart display from sessionStorage
    updateCartDisplay();

    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            clearCart();
        });
    }

    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            window.location.href = 'payment.html';
        });
    }

    // Drag and drop for cart
    if (cartDropZone) {
        cartDropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });

        cartDropZone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });

        cartDropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const productId = parseInt(e.dataTransfer.getData('text/plain'));
            addToCart(productId);
        });
    }
}

function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" 
             draggable="true" 
             data-product-id="${product.id}"
             ondragstart="handleDragStart(event)"
             ondragend="handleDragEnd(event)">
            <img src="${product.image}" alt="${product.name} мороженое" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price} ₽</p>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        </div>
    `).join('');
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.productId);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// ==========================================
// Payment Page
// ==========================================
function initPaymentPage() {
    const orderSummary = document.querySelector('.order-summary');
    const orderItems = document.querySelector('.order-items');
    const orderTotalPrice = document.querySelector('.order-total-price');
    const confirmBtn = document.querySelector('.confirm-btn');
    const confirmationMessage = document.querySelector('.confirmation-message');

    if (!orderSummary) return;

    // Load cart
    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'catalog.html';
        return;
    }

    // Display order items
    if (orderItems) {
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <span>${item.name} ${item.quantity > 1 ? `× ${item.quantity}` : ''}</span>
                <span>${item.price * item.quantity} ₽</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (orderTotalPrice) {
            orderTotalPrice.innerHTML = `
                <span>Итого:</span>
                <span>${total} ₽</span>
            `;
        }
    }

    // Confirm button
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // Clear cart
            sessionStorage.removeItem('iceCreamCart');
            
            // Show confirmation
            orderSummary.style.display = 'none';
            confirmBtn.style.display = 'none';
            
            if (confirmationMessage) {
                confirmationMessage.classList.remove('hidden');
            }
        });
    }
}

// ==========================================
// Yandex Maps
// ==========================================
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Check if Yandex Maps API is loaded
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API not loaded');
        return;
    }

    // Create map centered on the address
    // Coordinates for Moscow, Vernadsky Avenue 78, building 4
    const coordinates = [55.669980, 37.480400];

    const map = new ymaps.Map('map', {
        center: coordinates,
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl']
    });

    // Add placemark
    const placemark = new ymaps.Placemark(coordinates, {
        balloonContent: `
            <div style="padding: 10px;">
                <strong>Магазин мороженого</strong><br>
                Москва, проспект Вернадского 78,<br>
                строение 4, 119454
            </div>
        `,
        hintContent: 'Магазин мороженого'
    }, {
        preset: 'islands#redFoodIcon'
    });

    map.geoObjects.add(placemark);
}

// Initialize map when API is ready
if (typeof ymaps !== 'undefined') {
    ymaps.ready(initMap);
}
