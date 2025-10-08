// ======== Переключение категорий ========
function showCategory(id) {
  document.querySelectorAll('.category').forEach(cat => {
    cat.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// ======== Корзина ========
let cart = [];

function addToCart(product) {
  cart.push(product);
  console.log("🛍️ Товар добавлен:", product);
  alert(`✅ ${product} добавлен в корзину`);
}

// ======== Отправка заказа в Telegram ========
function sendOrderToTelegram() {
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(cart));
  } else {
    alert("❌ Telegram WebApp не найден");
  }
}

// ======== (Опционально) Загрузка товаров из API ========
async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  const container = document.querySelector('#sushi .products');
  container.innerHTML = '';

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image || 'images/default.jpg'}" />
        <h3>${p.Название}</h3>
        <p>${p.Описание}</p>
        <div class="price">${p.Цена} ₽</div>
        <button onclick="addToCart('${p.Название}')">В корзину</button>
      </div>
    `;
  });
}

window.addEventListener('DOMContentLoaded', loadProducts);
