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
    renderProducts();
    setupEventListeners();
    updateCartUI();
});

// ... остальной код остается таким же ...

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

// ... остальные функции остаются такими же до showOrderForm ...

// Форма заказа
function showOrderForm() {
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
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
    document.querySelector('.cart-total').classList.remove('hidden');
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

// ... остальной код остается таким же ...