from aiogram import Bot
from aiogram.types import MenuButtonWebApp, WebAppInfo
import asyncio

API_TOKEN = "8286962389:AAH245UEMK5XYHg9ZKU8N5tcTXu0wG1gV9E"
bot = Bot(API_TOKEN)

async def set_menu_button():
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="📂 Меню",
            web_app=WebAppInfo(url="https://sfu-onlineshop.onrender.com")
        )
    )
    print("✅ Кнопка 'Меню' установлена!")

asyncio.run(set_menu_button())
