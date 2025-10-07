from flask import Flask, jsonify, send_from_directory   # ← ДОБАВЬ send_from_directory
import sqlite3

app = Flask(__name__)

@app.route("/api/products")
def get_products():
    conn = sqlite3.connect("shop.db")
    cursor = conn.cursor()
    cursor.execute("SELECT Название, Цена, Описание FROM Товар")
    rows = cursor.fetchall()
    conn.close()

    products = [
        {"name": r[0], "price": r[1], "desc": r[2], "image": "/static/noimage.png"}
        for r in rows
    ]
    return jsonify(products)

# 📁 Маршрут для главной страницы
@app.route("/")
def index():
    return send_from_directory("web", "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
