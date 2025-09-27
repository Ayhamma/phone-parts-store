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
    }
];

// Корзина
let cart = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем корзину из LocalStorage
    loadCartFromLocalStorage();
    
    // Рендерим товары
    renderProducts();
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Обновляем UI корзины
    updateCartUI();
});

// Рендер товаров
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
    alert(`Товар "${product.name}" добавлен в корзину!`);
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
                <button onclick="changeQuantity(${product.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${product.id}, 1)">+</button>
                <button onclick="removeFromCart(${product.id})">×</button>
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

// Модальные окна
function setupEventListeners() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            cartModal.style.display = 'block';
        });
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            alert('Заказ создан! Спасибо за покупку!');
            cart = [];
            updateCart();
            cartModal.style.display = 'none';
        });
    }
    
    // Закрытие при клике вне окна
    window.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cart-modal');
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
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

// Временный код для очистки проблемных данных
setTimeout(() => {
    // Очищаем возможные поврежденные данные
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