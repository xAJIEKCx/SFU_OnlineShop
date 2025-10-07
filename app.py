from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from datetime import datetime

app = Flask(__name__)

DB_PATH = "shop.db"  # название твоей SQLite базы

# 🔌 Утилита подключения к БД
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ✅ Главная страница (frontend)
@app.route("/")
def index():
    return send_from_directory("web", "index.html")

# 📁 Получение всех категорий
@app.route("/api/categories", methods=["GET"])
def get_categories():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT ID_категории, Название FROM Категория")
    categories = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(categories)

# 📦 Получение списка товаров (с фильтром по категории)
@app.route("/api/products", methods=["GET"])
def get_products():
    category_id = request.args.get("category_id")
    conn = get_db()
    cur = conn.cursor()

    if category_id:
        cur.execute("""
            SELECT ID_товара, Название, Цена, Описание, Рейтинг
            FROM Товар WHERE ID_категории = ?
        """, (category_id,))
    else:
        cur.execute("""
            SELECT ID_товара, Название, Цена, Описание, Рейтинг
            FROM Товар
        """)

    products = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(products)

# 👤 Регистрация пользователя при первом запуске бота
@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    telegram_id = data.get("telegram_id")
    name = data.get("name", "Без имени")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT OR IGNORE INTO Пользователь (telegram_id, ФИО, дата_регистрации)
        VALUES (?, ?, ?)
    """, (telegram_id, name, datetime.now().isoformat()))
    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "message": "Пользователь зарегистрирован"})

# 🛍️ Оформление заказа
@app.route("/api/order", methods=["POST"])
def create_order():
    data = request.get_json()
    telegram_id = data.get("telegram_id")
    items = data.get("items", [])  # [{'product_id': 1, 'qty': 2}, ...]

    conn = get_db()
    cur = conn.cursor()

    for item in items:
        cur.execute("""
            INSERT INTO Покупка (ID_пользователя, ID_товара, Дата)
            VALUES (
                (SELECT ID_пользователя FROM Пользователь WHERE telegram_id=?),
                ?,
                ?
            )
        """, (telegram_id, item["product_id"], datetime.now().isoformat()))

    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "message": "Заказ успешно оформлен"})

# ⭐ Оценка товара
@app.route("/api/rate", methods=["POST"])
def rate_product():
    data = request.get_json()
    telegram_id = data.get("telegram_id")
    product_id = data.get("product_id")
    rating = data.get("rating")

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO Оценка (ID_пользователя, ID_товара, Оценка)
        VALUES (
            (SELECT ID_пользователя FROM Пользователь WHERE telegram_id=?),
            ?, ?
        )
    """, (telegram_id, product_id, rating))

    # 📊 Обновление среднего рейтинга товара
    cur.execute("""
        UPDATE Товар
        SET Рейтинг = (SELECT AVG(Оценка) FROM Оценка WHERE ID_товара = ?)
        WHERE ID_товара = ?
    """, (product_id, product_id))

    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "message": "Спасибо за вашу оценку!"})

# 📜 История покупок пользователя
@app.route("/api/orders/<telegram_id>", methods=["GET"])
def get_orders(telegram_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        SELECT Товар.Название, Товар.Цена, Покупка.Дата
        FROM Покупка
        JOIN Товар ON Товар.ID_товара = Покупка.ID_товара
        JOIN Пользователь ON Пользователь.ID_пользователя = Покупка.ID_пользователя
        WHERE Пользователь.telegram_id = ?
        ORDER BY Покупка.Дата DESC
    """, (telegram_id,))
    orders = [dict(row) for row in cur.fetchall()]
    conn.close()
    return jsonify(orders)

# 🔥 Запуск сервера
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
