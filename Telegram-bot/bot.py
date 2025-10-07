# bot.py
from aiogram import Bot, Dispatcher, types, F
import asyncio

API_TOKEN = "8286962389:AAH245UEMK5XYHg9ZKU8N5tcTXu0wG1gV9E"
bot = Bot(API_TOKEN)
dp = Dispatcher()

@dp.message(F.text == "/start")
async def start(message: types.Message):
    kb = types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_button = types.KeyboardButton(text="🛍️ Открыть магазин", web_app=types.WebAppInfo(url="https://your-domain.com"))
    kb.add(web_button)

    await message.answer("Добро пожаловать! Нажми, чтобы открыть магазин 👇", reply_markup=kb)

@dp.message(F.web_app_data)
async def receive_cart(message: types.Message):
    cart = message.web_app_data.data
    await message.answer(f"🛒 Вы выбрали: {cart}")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
