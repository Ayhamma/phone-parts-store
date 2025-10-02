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
    },
	
	{ 	id: 4,
		name: "Дисплей iPhone 11",
		price: 7600,
		image: "imgs/4.jpg",
		description: "Дисплейный модуль для iPhone 11 (LCD)",
		inStock: 12
	},
	
	{ 	id: 5,
		name: "Зарядный порт iPhone 12",
		price: 1100,
		image: "imgs/5.jpg",
		description: "Шлейф зарядного порта iPhone 12",
		inStock: 20 
	},
	
	{ 	id: 6,
		name: "Камера задняя Samsung S21",
		price: 5900,
		image: "imgs/6.jpg",
		description: "Оригинальная основная камера S21",
		inStock: 6 
	},
	
	{ 	id: 7,
		name: "Стекло камеры Xiaomi RN10",
		price: 350,
		image: "imgs/7.jpg",
		description: "Защитное стекло камеры Redmi Note 10",
		inStock: 50 
	},
	
	{ 	id: 8,
		name: "Аккумулятор iPhone X",
		price: 2400,
		image: "imgs/8.jpg",
		description: "Li-Ion аккумулятор для iPhone X",
		inStock: 9 
	},
	
	{ 	id: 9,
		name: "Защитное стекло 6.1″",
		price: 300,
		image: "imgs/9.jpg",
		description: "Закалённое стекло для 6.1″ (12/12 Pro/13/14)",
		inStock: 100 
	},
	
	{ 	id: 10,
		name: "Кабель USB-C → Lightning",
		price: 700,
		image: "imgs/10.jpg",
		description: "Кабель быстрой зарядки 1 м",
		inStock: 40 
	}
];

// Корзина
let cart = [];

// Checkout state
let currentStep = 'cart'; // 'cart' | 'payment'

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

    // Анимация bump на кнопке корзины
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

    // Кол-во позиций
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Итоговая сумма
    const total = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product.price * item.quantity);
    }, 0);
    totalPrice.textContent = total;

    // Список товаров в корзине
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

// События и логика шагов
function setupEventListeners() {
    const cartButton = document.getElementById('cart-button');
    const closeButton = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    const backToCartBtn = document.getElementById('back-to-cart');
    const paymentForm = document.getElementById('payment-form');

    // Открыть корзину
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            openCart();
            goToStep('cart');
        });
    }

    // Закрыть модалку
    if (closeButton) {
        closeButton.addEventListener('click', closeCart);
    }

    // Перейти к оплате
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Корзина пуста!', 'warning');
                return;
            }
            fillOrderSummary();
            const total = document.getElementById('total-price')?.textContent || '0';
            const payable = document.getElementById('payable-amount');
            if (payable) payable.textContent = total;
            goToStep('payment');
        });
    }

    // Назад к корзине
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', () => goToStep('cart'));
    }

    // Submit формы оплаты (демо)
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors(paymentForm);
            const valid = validatePaymentForm(paymentForm);
            if (!valid) return;

            const payBtn = document.getElementById('pay-btn');
            payBtn.disabled = true;
            payBtn.textContent = 'Обрабатываем...';

            // Имитация проверки/платежа
            await new Promise(r => setTimeout(r, 1200));

            showNotification('Оплата прошла успешно! Заказ оформлен.', 'success');
            cart = [];
            updateCart();
            goToStep('cart');
            closeCart();

            payBtn.disabled = false;
            payBtn.textContent = 'Оплатить';
        });
    }

    // Клик вне содержимого — закрыть
    window.addEventListener('click', function(event) {
        const cartModal = document.getElementById('cart-modal');
        if (event.target === cartModal) {
            closeCart();
        }
    });

    // ESC — закрыть
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCart();
        }
    });

    // Маски ввода для карт
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvc = document.getElementById('cardCvc');

    if (cardNumber) {
        cardNumber.addEventListener('input', () => {
            let v = cardNumber.value.replace(/\D/g, '').slice(0,16);
            cardNumber.value = v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        });
    }
    if (cardExpiry) {
        cardExpiry.addEventListener('input', () => {
            let v = cardExpiry.value.replace(/\D/g, '').slice(0,4);
            if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
            cardExpiry.value = v;
        });
    }
    if (cardCvc) {
        cardCvc.addEventListener('input', () => {
            cardCvc.value = cardCvc.value.replace(/\D/g, '').slice(0,4);
        });
    }
}

// Функции переключения шагов/модалки
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

function goToStep(step) {
    currentStep = step;
    const stepCart = document.getElementById('step-cart');
    const stepPayment = document.getElementById('step-payment');
    const title = document.getElementById('cart-title');

    if (step === 'cart') {
        stepCart.style.display = '';
        stepPayment.style.display = 'none';
        if (title) title.textContent = '🛒 Ваша корзина';
    } else {
        stepCart.style.display = 'none';
        stepPayment.style.display = '';
        if (title) title.textContent = '💳 Оплата заказа';
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Закрыть уведомление">&times;</button>
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

// Заполнение сводки заказа
function fillOrderSummary() {
    const summary = document.getElementById('order-summary');
    if (!summary) return;
    const list = cart.map(item => {
        const p = products.find(pr => pr.id === item.productId);
        return `<li>${p.name} — ${p.price} × ${item.quantity} = ${p.price * item.quantity} руб.</li>`;
    }).join('');
    const total = document.getElementById('total-price')?.textContent || '0';
    summary.innerHTML = `
      <strong>Ваш заказ:</strong>
      <ul>${list}</ul>
      <div style="margin-top:.35rem;"><strong>Итого: ${total} руб.</strong></div>
    `;
}

// Валидация формы оплаты (демо)
function clearErrors(form) {
    form.querySelectorAll('.error').forEach(e => e.textContent = '');
}

function setError(input, message) {
    const holder = input.closest('.form-field');
    const small = holder?.querySelector('.error');
    if (small) small.textContent = message || '';
}

function luhnCheck(num) {
    const digits = num.replace(/\s+/g,'');
    let sum = 0, shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = parseInt(digits[i], 10);
        if (shouldDouble) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0 && digits.length >= 13;
}

function validatePaymentForm(form) {
    let ok = true;

    const fullName = form.querySelector('#fullName');
    if (!fullName.value.trim()) { setError(fullName, 'Укажите ФИО'); ok = false; }

    const email = form.querySelector('#email');
    if (!/^\S+@\S+\.\S+$/.test(email.value)) { setError(email, 'Некорректный e-mail'); ok = false; }

    const phone = form.querySelector('#phone');
    if (phone.value.replace(/\D/g,'').length < 10) { setError(phone, 'Укажите телефон'); ok = false; }

    const address = form.querySelector('#address');
    if (!address.value.trim()) { setError(address, 'Укажите адрес'); ok = false; }

    const cardNumber = form.querySelector('#cardNumber');
    if (!luhnCheck(cardNumber.value)) { setError(cardNumber, 'Неверный номер карты'); ok = false; }

    const cardExpiry = form.querySelector('#cardExpiry');
    const m = cardExpiry.value.match(/^(\d{2})\/(\d{2})$/);
    if (!m) { setError(cardExpiry, 'MM/YY'); ok = false; }
    else {
        const mm = +m[1], yy = +m[2];
        if (mm < 1 || mm > 12) { setError(cardExpiry, 'Месяц 01–12'); ok = false; }
        // Простая проверка срока (20YY)
        const now = new Date();
        const exp = new Date(2000 + yy, mm); // первое число следующего месяца
        if (exp <= now) { setError(cardExpiry, 'Срок истёк'); ok = false; }
    }

    const cardCvc = form.querySelector('#cardCvc');
    if (!/^\d{3,4}$/.test(cardCvc.value)) { setError(cardCvc, '3–4 цифры'); ok = false; }

    return ok;
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

// Очистка потенциально повреждённых данных
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
