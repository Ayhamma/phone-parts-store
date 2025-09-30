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
    
    // Animate cart button bump instead of alert
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

// Система заказов и оплаты
function createOrder(customerData) {
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: getCartTotal(),
        customer: customerData,
        status: 'pending', // pending, paid, completed, cancelled
        paymentMethod: customerData.paymentMethod
    };
    
    orders.push(order);
    saveOrdersToLocalStorage();
    return order;
}

function getCartTotal() {
    return cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
}

function processPayment(order, cardData = null) {
    return new Promise((resolve, reject) => {
        // Симуляция процесса оплаты
        showNotification('Обрабатываем платеж...', 'info');
        
        setTimeout(() => {
            // В реальном приложении здесь будет интеграция с платежным шлюзом
            const success = Math.random() > 0.2; // 80% успешных платежей для демо
            
            if (success) {
                order.status = 'paid';
                saveOrdersToLocalStorage();
                resolve({ success: true, orderId: order.id });
            } else {
                reject({ success: false, error: 'Ошибка оплаты. Проверьте данные карты.' });
            }
        }, 2000);
    });
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

// Форма оформления заказа
function showCheckoutForm() {
    const total = getCartTotal();
    
    const checkoutHTML = `
        <div class="checkout-overlay">
            <div class="checkout-modal">
                <div class="checkout-header">
                    <h2>💳 Оформление заказа</h2>
                    <button class="close-checkout">&times;</button>
                </div>
                
                <div class="checkout-content">
                    <div class="order-summary">
                        <h3>Ваш заказ</h3>
                        ${cart.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            return `<div class="order-item">
                                <span>${product.name} × ${item.quantity}</span>
                                <span>${product.price * item.quantity} руб.</span>
                            </div>`;
                        }).join('')}
                        <div class="order-total">
                            <strong>Итого: ${total} руб.</strong>
                        </div>
                    </div>
                    
                    <form id="checkout-form" class="checkout-form">
                        <h3>Данные для доставки</h3>
                        
                        <div class="form-group">
                            <label for="customer-name">ФИО *</label>
                            <input type="text" id="customer-name" name="name" required placeholder="Иванов Иван Иванович">
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-email">Email *</label>
                            <input type="email" id="customer-email" name="email" required placeholder="ivanov@example.com">
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-phone">Телефон *</label>
                            <input type="tel" id="customer-phone" name="phone" required placeholder="+7 (999) 999-99-99">
                        </div>
                        
                        <div class="form-group">
                            <label for="customer-address">Адрес доставки *</label>
                            <textarea id="customer-address" name="address" required placeholder="Город, улица, дом, квартира"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Способ оплаты *</label>
                            <div class="payment-methods">
                                <label class="payment-method">
                                    <input type="radio" name="paymentMethod" value="card" checked>
                                    <span>💳 Банковская карта</span>
                                </label>
                                <label class="payment-method">
                                    <input type="radio" name="paymentMethod" value="cash">
                                    <span>💰 Наличные при получении</span>
                                </label>
                            </div>
                        </div>
                        
                        <div id="card-data" class="card-data">
                            <h4>Данные карты</h4>
                            <div class="form-group">
                                <label for="card-number">Номер карты</label>
                                <input type="text" id="card-number" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="card-expiry">Срок действия</label>
                                    <input type="text" id="card-expiry" name="cardExpiry" placeholder="ММ/ГГ" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="card-cvc">CVC</label>
                                    <input type="text" id="card-cvc" name="cardCvc" placeholder="123" maxlength="3">
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" class="pay-now-btn">
                            💳 Оплатить ${total} руб.
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    
    // Настройка обработчиков событий для формы
    setupCheckoutFormEvents();
}

function setupCheckoutFormEvents() {
    const closeBtn = document.querySelector('.close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardData = document.getElementById('card-data');
    
    // Закрытие формы
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCheckoutForm);
    }
    
    // Переключение способов оплаты
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardData.style.display = 'block';
            } else {
                cardData.style.display = 'none';
            }
        });
    });
    
    // Обработка отправки формы
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Маска для номера карты
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            
            for (let i = 0; i < match.length; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            
            if (parts.length) {
                e.target.value = parts.join(' ');
            }
        });
    }
    
    // Маска для срока действия
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
        });
    }
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const customerData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    const submitBtn = e.target.querySelector('.pay-now-btn');
    const originalText = submitBtn.textContent;
    
    // Валидация
    if (!customerData.name || !customerData.email || !customerData.phone || !customerData.address) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
        return;
    }
    
    if (customerData.paymentMethod === 'card') {
        const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
        const cardExpiry = formData.get('cardExpiry');
        const cardCvc = formData.get('cardCvc');
        
        if (!cardNumber || cardNumber.length !== 16 || !cardExpiry || !cardCvc) {
            showNotification('Пожалуйста, проверьте данные карты', 'warning');
            return;
        }
    }
    
    // Блокируем кнопку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Обрабатываем...';
    
    try {
        // Создаем заказ
        const order = createOrder(customerData);
        
        if (customerData.paymentMethod === 'cash') {
            // Оплата наличными
            showNotification('Заказ создан! Оплата при получении.', 'success');
            cart = [];
            updateCart();
            closeCart();
            closeCheckoutForm();
        } else {
            // Оплата картой
            const paymentResult = await processPayment(order);
            
            if (paymentResult.success) {
                showNotification(`Заказ №${order.id} оплачен! Спасибо за покупку!`, 'success');
                cart = [];
                updateCart();
                closeCart();
                closeCheckoutForm();
            }
        }
    } catch (error) {
        showNotification(error.error || 'Произошла ошибка при оформлении заказа', 'warning');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function closeCheckoutForm() {
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    if (checkoutOverlay) {
        checkoutOverlay.remove();
    }
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
    
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--surface);
                border-radius: var(--radius);
                padding: 1rem 1.5rem;
                box-shadow: var(--shadow);
                z-index: 2000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                border-left: 4px solid var(--primary);
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left-color: var(--success); }
            .notification-warning { border-left-color: #f39c12; }
            .notification button {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: var(--muted);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
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