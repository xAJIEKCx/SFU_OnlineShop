// Получаем товары с сервера
fetch("/api/products")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("products");
    data.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>${p.price} ₽</p>
        <button onclick="addToCart('${p.name}')">🛒 В корзину</button>
      `;
      container.appendChild(card);
    });
  });

let cart = [];

function addToCart(name) {
  cart.push(name);
}

document.getElementById("checkout").addEventListener("click", () => {
  Telegram.WebApp.sendData(JSON.stringify(cart)); // 📤 отправляем заказ обратно боту
});
