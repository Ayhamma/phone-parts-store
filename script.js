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
const productsContainer = document.getElementById('products-container');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalPrice = document.getElementById('total-price');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-btn');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    renderProducts(); // ТЕПЕРЬ ЭТА ФУНКЦИЯ ЕСТЬ!
    setupEventListeners();
    updateCartUI();
    fixButtonText();
});

// НАША ФУНКЦИЯ renderProducts!
function renderProducts() {
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

// Исправляем опечатку в кнопках
function fixButtonText() {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        if (button.textContent.includes('и корзину')) {
            button.textContent = button.textContent.replace('и корзину', 'в корзину');
        }
        if (button.textContent.includes('и корзину')) {
            button.textContent = 'Добавить в корзину';
        }
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    cartButton.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', showOrderForm);
    
    // Форма заказа
    document.getElementById('back-to-cart').addEventListener('click', showCart);
    document.getElementById('order-form').addEventListener('submit', submitOrder);
    document.getElementById('close-cart').addEventListener('click', closeCartAfterOrder);
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });
}

// Функции корзины
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        if (cartItem.quantity < product.inStock) {
            cartItem.quantity++;
            showNotification(`Товар "${product.name}" добавлен в корзину!`);
        } else {
            showNotification('Недостаточно товара в наличии!', 'error');
            return;
        }
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
        showNotification(`Товар "${product.name}" добавлен в корзину!`);
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
            showNotification('Недостаточно товара в наличии!', 'error');
        }
    }
    
    updateCart();
}

function updateCart() {
    saveCartToLocalStorage();
    updateCartUI();
    renderProducts(); // Обновляем кнопки товаров
    fixButtonText(); // Исправляем текст кнопок
}

function updateCartUI() {
    // Обновляем счетчик в хедере
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Обновляем содержимое корзины
    renderCartItems();
    
    // Обновляем итоговую сумму
    updateTotalPrice();
}

function renderCartItems() {
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
                <p>${product.price} руб. × ${item.quantity} = ${product.price * item.quantity} руб.</p>
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
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    totalPrice.textContent = total;
}

// Работа с модальным окном
function openCart() {
    cartModal.style.display = 'block';
}

function closeCart() {
    cartModal.style.display = 'none';
}

// Форма заказа
function showOrderForm() {
    if (cart.length === 0) {
        showNotification('Корзина пуста! Добавьте товары перед оформлением заказа.', 'error');
        return;
    }
    
    // Скрываем корзину, показываем форму
    document.getElementById('cart-items').classList.add('hidden');
    document.querySelector('.cart-total').classList.add('hidden');
    checkoutBtn.classList.add('hidden');
    document.getElementById('order-form').classList.remove('hidden');
}

function showCart() {
    // Показываем корзину, скрываем форму
    document.getElementById('cart-items').classList.remove('hidden');
    document.querySelector('.cart-total').classlist.remove('hidden');
    checkoutBtn.classList.remove('hidden');
    document.getElementById('order-form').classList.add('hidden');
}

function submitOrder(event) {
    event.preventDefault();
    
    // Получаем данные формы
    const formData = new FormData(document.getElementById('order-form'));
    const orderData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        items: cart,
        total: calculateTotal(),
        date: new Date().toLocaleString()
    };
    
    // В реальном приложении здесь бы была отправка на сервер
    console.log('Заказ создан:', orderData);
    
    // Показываем сообщение об успехе
    document.getElementById('order-form').classList.add('hidden');
    document.getElementById('order-success').classList.remove('hidden');
    
    // Очищаем корзину через 5 секунд
    setTimeout(() => {
        cart = [];
        updateCart();
        document.getElementById('order-success').classList.add('hidden');
        showCart();
        document.getElementById('order-form').reset();
        closeCart();
    }, 5000);
}

function closeCartAfterOrder() {
    cart = [];
    updateCart();
    document.getElementById('order-success').classList.add('hidden');
    showCart();
    document.getElementById('order-form').reset();
    closeCart();
}

function calculateTotal() {
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
}

// Уведомления
function showNotification(message, type = 'success') {
    // Создаем уведомление только если его нет
    if (document.querySelector('.notification')) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#e74c3c' : '#27ae60';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}