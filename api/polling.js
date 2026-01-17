import TelegramBot from "node-telegram-bot-api";
import handleUpdate from "./bot-handler.js";

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing");
}

const bot = new TelegramBot(token, { polling: true });

console.log("Telegram bot polling started");

bot.on("message", async (msg) => {
  try {
    await handleUpdate(
      {
        update_id: Date.now(),
        message: msg
      },
      {
        BOT_TOKEN: token
      }
    );
  } catch (err) {
    console.error("Update error:", err);
  }
});