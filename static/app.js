// Глобальные переменные
let cart = []; // корзина товаров
const tg = window.Telegram.WebApp; // объект Telegram WebApp

// Выдвижное боковое меню
function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const container = document.querySelector(".container");
  const overlay = document.getElementById("overlay");
  const isOpen = sidebar.classList.toggle("open");
  overlay.classList.toggle("active", isOpen);
  if (window.innerWidth > 768) {
    container.classList.toggle("shifted", isOpen);
  }
}

// Переключение категорий

function showCategory(id) {
  document.querySelectorAll(".category").forEach(cat => {
    cat.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// Добавление товаров в корзину

function addToCart(productName) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, quantity: 1 });
  }
  updateCartButton();
}

// Обновление текста кнопки корзины

function updateCartButton() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  tg.MainButton.text = totalItems > 0 ? `🛒 Оформить заказ (${totalItems})` : "🛒 Корзина пуста";
  tg.MainButton.show();
}

// 📤 Отправка корзины в Telegram

tg.MainButton.onClick(() => {
  if (cart.length === 0) {
    alert("Ваша корзина пуста!");
    return;
  }

  // Формируем заказ
  const order = {
    telegram_id: tg.initDataUnsafe?.user?.id,
    items: cart.map(item => ({
      name: item.name,
      quantity: item.quantity
    }))
  };

  // Отправляем данные обратно в Telegram
  tg.sendData(JSON.stringify(order));
});

// Инициализация WebApp

window.addEventListener("DOMContentLoaded", () => {
  tg.expand();
  tg.MainButton.setParams({
    text: "🛒 Корзина пуста",
    color: "#4caf50",
    text_color: "#ffffff"
  });

  updateCartButton();
});

// Добавление в корзину
function addToCart(name, price) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCart();
}

// Обновление корзины (счётчик + содержимое)
function updateCart() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let total = 0;
  let count = 0;
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} × ${item.qty}</span>
        <span>${itemTotal} ₽</span>
      </div>
    `;
  });

  cartCount.textContent = count;
  cartTotal.textContent = total + " ₽";
}

// Открытие / закрытие корзины
function toggleCart() {
  const popup = document.getElementById("cart-popup");
  popup.classList.toggle("active");
}

// Оформление заказа
function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста 😅");
    return;
  }

  let orderSummary = cart.map(i => `${i.name} × ${i.qty}`).join("\n");
  alert("Спасибо за заказ! 🎉\n\nВаш заказ:\n" + orderSummary);

  cart = [];
  updateCart();
  toggleCart();
}
