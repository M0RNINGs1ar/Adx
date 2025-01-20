const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Telegram Bot
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Simple command to start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the bot! Type /help for commands.');
});

// More bot logic goes here
