// Регистрация пользователя
await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ telegram_id: Telegram.WebApp.initDataUnsafe.user.id, name: Telegram.WebApp.initDataUnsafe.user.first_name })
})

// Оформление заказа
await fetch("/api/order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    telegram_id: Telegram.WebApp.initDataUnsafe.user.id,
    items: [{ product_id: 1, qty: 2 }]
  })
})
// Переключение категорий
function showCategory(id) {
  document.querySelectorAll('.category').forEach(cat => {
    cat.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// Добавление в корзину
let cart = [];

function addToCart(product) {
  cart.push(product);
  alert(`✅ ${product} добавлен в корзину`);
}

// Отправка данных в Telegram (опционально)
function sendOrderToTelegram() {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(cart));
  }
}

