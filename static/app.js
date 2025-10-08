// ================================
// 📦 Глобальные переменные
// ================================
let cart = []; // корзина товаров
const tg = window.Telegram.WebApp; // объект Telegram WebApp

// ================================
// 📁 Переключение категорий
// ================================
function showCategory(id) {
  document.querySelectorAll(".category").forEach(cat => {
    cat.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// ================================
// 🛒 Добавление товаров в корзину
// ================================
function addToCart(productName) {
  const existing = cart.find(item => item.name === productName);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: productName, quantity: 1 });
  }
  updateCartButton();
}

// ================================
// 🧮 Обновление текста кнопки корзины
// ================================
function updateCartButton() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  tg.MainButton.text = totalItems > 0 ? `🛒 Оформить заказ (${totalItems})` : "🛒 Корзина пуста";
  tg.MainButton.show();
}

// ================================
// 📤 Отправка корзины в Telegram
// ================================
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

  // 💡 Если хочешь отправить заказ сразу на сервер:
  /*
  fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Заказ отправлен:", data);
      tg.sendData(JSON.stringify(order)); // уведомляем бота
    });
  */
});

// ================================
// 🧪 Инициализация WebApp
// ================================
window.addEventListener("DOMContentLoaded", () => {
  tg.expand(); // растягиваем WebApp на всю высоту
  tg.MainButton.setParams({
    text: "🛒 Корзина пуста",
    color: "#4caf50",
    text_color: "#ffffff"
  });

  updateCartButton();
});
