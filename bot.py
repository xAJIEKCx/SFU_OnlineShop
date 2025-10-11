from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
import asyncio

API_TOKEN = "8286962389:AAH245UEMK5XYHg9ZKU8N5tcTXu0wG1gV9E"
bot = Bot(API_TOKEN)
dp = Dispatcher()

@dp.message(Command("start"))
async def start(message: types.Message):
    kb = types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(
                    text="🛍️ Открыть магазин",
                    web_app=types.WebAppInfo(url="https://sfu-onlineshop.onrender.com")
                )
            ]
        ]
    )

    await message.answer(
        "👋 Добро пожаловать в наш интернет-магазин!\nНажми кнопку ниже, чтобы открыть каталог:",
        reply_markup=kb
    )

@dp.message(F.web_app_data)
async def receive_cart(message: types.Message):
    cart = message.web_app_data.data
    await message.answer(f"🛒 Ваш заказ: {cart}")

async def main():
    print("🤖 Бот запущен...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
