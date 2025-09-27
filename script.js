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
    renderProducts();
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    cartButton.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });
}

// Рендер товаров
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
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
        `;
        productsContainer.appendChild(productCard);
    });
}

// Функции корзины (пока заглушки)
function addToCart(productId) {
    alert('Функция "Добавить в корзину" скоро будет реализована!');
}

function openCart() {
    cartModal.style.display = 'block';
}

function closeCart() {
    cartModal.style.display = 'none';
}

// Заглушка для корзины
cartItems.innerHTML = '<p>Корзина пуста. Добавьте товары из каталога!</p>';
