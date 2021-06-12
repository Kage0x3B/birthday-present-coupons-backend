import TelegramBot from "node-telegram-bot-api";
import config from "./config.mjs";

const chatIdList = ["591106690"];

let bot;

if (config.telegram.token) {
    console.log("Creating new Telegram bot instance " + config.telegram.token);

    bot = new TelegramBot(config.telegram.token, { polling: true });

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;

        bot.sendMessage(chatId, `Your chatId is ${chatId}`);
    });
}

export function sendMessage(content, options) {
    const promises = [];

    if (bot) {
        for (const chatId of chatIdList) {
            promises.push(bot.sendMessage(chatId, content, options));
        }
    }

    return Promise.all(promises);
}
