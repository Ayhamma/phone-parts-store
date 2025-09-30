// Данные товаров
const products = [
    {
        id: 1,
        name: "Дисплей iPhone 12",
        price: 8500,
        image: "imgs/1.jpg",
        description: "Оригинальный дисплейный модуль для iPhone 12",
        inStock: 15
    },
    {
        id: 2,
        name: "Аккумулятор Samsung S21",
        price: 2200,
        image: "imgs/2.jpg",
        description: "Аккумулятор для Samsung Galaxy S21",
        inStock: 8
    },
    {
        id: 3,
        name: "Корпус Xiaomi Redmi Note 10",
        price: 1500,
        image: "imgs/3.jpg",
        description: "Задняя крышка корпуса",
        inStock: 5
    }
];

// Корзина и заказы
let cart = [];
let orders = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadOrdersFromLocalStorage();
    renderProducts();
    setupEventListeners();
    updateCartUI();
});

// Рендер товаров - ИСПРАВЛЕННАЯ ВЕРСИЯ
function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price} руб.</div>
            <div class="stock">В наличии: ${product.inStock} шт.</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Добавить в корзину
            </button>
            ${currentQuantity > 0 ? `<div class="in-cart">В корзине: ${currentQuantity} шт.</div>` : ''}
        `;
        productsContainer.appendChild(productCard);
    });
}

// Функции корзины
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    let cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Animate cart button bump
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.classList.add('bump');
        setTimeout(() => {
            cartButton.classList.remove('bump');
        }, 300);
    }
}

function updateCart() {
    saveCartToLocalStorage();
    updateCartUI();
    renderProducts();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const totalPrice = document.getElementById('total-price');
    const cartItems = document.getElementById('cart-items');
    
    if (!cartCount || !totalPrice || !cartItems) return;
    
    // Обновляем счетчик
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Обновляем итоговую сумму
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    totalPrice.textContent = total;
    
    // Обновляем список товаров в корзине
    renderCartItems();
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--muted); padding: 2rem;">Корзина пуста. Добавьте товары из каталога!</p>';
        return;
    }
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-thumb">
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>${product.price} руб. × ${item.quantity} = ${product.price * item.quantity} руб.</p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${product.id}, -1)" title="Уменьшить">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${product.id}, 1)" title="Увеличить">+</button>
                <button onclick="removeFromCart(${product.id})" title="Удалить">×</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });
}

function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        cartItem.quantity += change;
        
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
}

// Professional Cart Drawer Events
function setupEventListeners() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Open cart drawer
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            openCart();
        });
    }
    
    // Close cart drawer
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeCart();
        });
    }
    
    // Checkout with improved UX
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Корзина пуста!', 'warning');
                return;
            }
            
            showCheckoutForm();
        });
    }
    
    // Close cart when clicking outside
    window.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cart-modal');
        if (event.target === cartModal) {
            closeCart();
        }
    });
    
    // ESC key to close cart
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCart();
            closeCheckoutForm();
        }
    });
}

// Cart drawer functions
function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('open');
        setTimeout(() => {
            const firstButton = cartModal.querySelector('button');
            if (firstButton) firstButton.focus();
        }, 300);
    }
}

function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('open');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            localStorage.removeItem('cart');
            cart = [];
        }
    }
}

function saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrdersFromLocalStorage() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        try {
            orders = JSON.parse(savedOrders);
        } catch (error) {
            localStorage.removeItem('orders');
            orders = [];
        }
    }
}

// Временный код для очистки проблемных данных
setTimeout(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            JSON.parse(savedCart);
        } catch (error) {
            localStorage.removeItem('cart');
            console.log('Удалены поврежденные данные корзины');
        }
    }
}, 1000);