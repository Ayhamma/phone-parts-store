// Данные товаров
const products = [
    {
        id: 1,
        name: "Дисплей iPhone 12",
        price: 8500,
        image: "https://via.placeholder.com/300x200/3498db/ffffff?text=iPhone+12+Display",
        description: "Оригинальный дисплейный модуль для iPhone 12",
        inStock: 15
    },
    {
        id: 2,
        name: "Аккумулятор Samsung S21",
        price: 2200,
        image: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=S21+Battery",
        description: "Аккумулятор для Samsung Galaxy S21",
        inStock: 8
    },
    {
        id: 3,
        name: "Корпус Xiaomi Redmi Note 10",
        price: 1500,
        image: "https://via.placeholder.com/300x200/2ecc71/ffffff?text=Redmi+Case",
        description: "Задняя крышка корпуса",
        inStock: 5
    },
    {
        id: 4,
        name: "Камера iPhone 13",
        price: 4200,
        image: "https://via.placeholder.com/300x200/9b59b6/ffffff?text=iPhone+Camera",
        description: "Основная камера для iPhone 13",
        inStock: 7
    },
    {
        id: 5,
        name: "Шлейф кнопки Samsung A52",
        price: 800,
        image: "https://via.placeholder.com/300x200/f39c12/ffffff?text=Button+Cable",
        description: "Шлейф кнопки включения и громкости",
        inStock: 12
    },
    {
        id: 6,
        name: "Стекло Huawei P30",
        price: 1200,
        image: "https://via.placeholder.com/300x200/34495e/ffffff?text=Huawei+Glass",
        description: "Защитное стекло экрана",
        inStock: 20
    }
];

// Корзина
let cart = [];

// DOM элементы
let productsContainer, cartButton, cartModal, orderModal, successModal;
let cartItems, orderItems, cartCount, totalPrice, orderTotalPrice;

// Инициализация - ЖДЕМ полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Инициализируем DOM элементы
    productsContainer = document.getElementById('products-container');
    cartButton = document.getElementById('cart-button');
    cartModal = document.getElementById('cart-modal');
    orderModal = document.getElementById('order-modal');
    successModal = document.getElementById('success-modal');
    cartItems = document.getElementById('cart-items');
    orderItems = document.getElementById('order-items');
    cartCount = document.getElementById('cart-count');
    totalPrice = document.getElementById('total-price');
    orderTotalPrice = document.getElementById('order-total-price');
    
    // СНАЧАЛА загружаем корзину из LocalStorage
    loadCartFromLocalStorage();
    
    // ПОТОМ настраиваем приложение
    setupEventListeners();
    renderProducts();
    updateCartUI();
    
    console.log('Корзина загружена:', cart); // Для отладки
}

// Настройка обработчиков
function setupEventListeners() {
    const closeModal = document.querySelector('.close');
    const closeOrder = document.querySelector('.close-order');
    const closeSuccess = document.getElementById('close-success');
    const checkoutBtn = document.getElementById('checkout-btn');
    const orderForm = document.getElementById('order-form');
    
    if (cartButton) cartButton.addEventListener('click', () => openModal(cartModal));
    if (closeModal) closeModal.addEventListener('click', () => closeModal(cartModal));
    if (closeOrder) closeOrder.addEventListener('click', () => closeModal(orderModal));
    if (closeSuccess) closeSuccess.addEventListener('click', () => closeModal(successModal));
    if (checkoutBtn) checkoutBtn.addEventListener('click', openOrderModal);
    if (orderForm) orderForm.addEventListener('submit', submitOrder);
    
    // Закрытие при клике вне окна
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) closeModal(cartModal);
        if (event.target === orderModal) closeModal(orderModal);
        if (event.target === successModal) closeModal(successModal);
    });
}

// Рендер товаров - ТЕПЕРЬ корзина уже загружена
function renderProducts() {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const cartItem = cart.find(item => item.productId === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        const isOutOfStock = currentQuantity >= product.inStock;
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${product.price} руб.</div>
            <div class="stock">В наличии: ${product.inStock} шт.</div>
            <button class="add-to-cart" 
                    onclick="addToCart(${product.id})" 
                    ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Нет в наличии' : 'Добавить в корзину'}
            </button>
            ${currentQuantity > 0 ? `<div class="in-cart">В корзине: ${currentQuantity} шт.</div>` : ''}
        `;
        productsContainer.appendChild(productCard);
    });
}

// Функции корзины
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.inStock) {
            cartItem.quantity++;
            showNotification(`✅ ${product.name} добавлен в корзину!`);
        } else {
            showNotification('❌ Недостаточно товара в наличии!');
            return;
        }
    } else {
        cart.push({ productId: productId, quantity: 1 });
        showNotification(`✅ ${product.name} добавлен в корзину!`);
    }
    
    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
}

function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else if (cartItem.quantity > product.inStock) {
            cartItem.quantity = product.inStock;
            showNotification('❌ Недостаточно товара в наличии!');
        }
    }
    updateCart();
}

function updateCart() {
    saveCartToLocalStorage();
    updateCartUI();
    renderProducts(); // Перерисовываем товары с обновленными количествами
}

function updateCartUI() {
    if (!cartCount || !totalPrice || !cartItems) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    renderCartItems();
    updateTotalPrice();
}

function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста. Добавьте товары из каталога!</p>';
        return;
    }
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <p>${product.price} руб. × ${item.quantity}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${product.id})">×</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });
}

function updateTotalPrice() {
    if (!totalPrice || !orderTotalPrice) return;
    
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    totalPrice.textContent = total;
    orderTotalPrice.textContent = total;
}

// Модальные окна
function openModal(modal) {
    if (modal) modal.style.display = 'block';
}

function closeModal(modal) {
    if (modal) modal.style.display = 'none';
}

function openOrderModal() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста! Добавьте товары.');
        return;
    }
    
    // Заполняем список товаров в форме
    if (orderItems) {
        orderItems.innerHTML = '';
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${product.name} × ${item.quantity}</span>
                <span>${product.price * item.quantity} руб.</span>
            `;
            orderItems.appendChild(orderItem);
        });
    }
    
    closeModal(cartModal);
    openModal(orderModal);
}

function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(document.getElementById('order-form'));
    const orderData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        items: cart,
        total: calculateTotal(),
        date: new Date().toLocaleString()
    };
    
    console.log('Заказ создан:', orderData);
    
    // Показываем успех
    closeModal(orderModal);
    openModal(successModal);
    
    // Очищаем корзину через 3 секунды
    setTimeout(() => {
        cart = [];
        updateCart();
        document.getElementById('order-form').reset();
        closeModal(successModal);
    }, 3000);
}

function calculateTotal() {
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.background = message.includes('❌') ? '#e74c3c' : '#27ae60';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// LocalStorage - ВАЖНО: проверяем что данные загружаются
function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Корзина сохранена:', cart);
    } catch (error) {
        console.error('Ошибка сохранения корзины:', error);
    }
}

function loadCartFromLocalStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Корзина загружена из LocalStorage:', cart);
        } else {
            console.log('Корзина в LocalStorage пуста');
            cart = []; // Убеждаемся что cart всегда массив
        }
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        cart = []; // На случай ошибки
    }
}