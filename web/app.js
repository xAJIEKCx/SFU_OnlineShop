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
