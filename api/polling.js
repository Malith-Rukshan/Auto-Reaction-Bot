import TelegramBot from "node-telegram-bot-api";
import { onUpdate } from "./bot-handler.js";
import TelegramBotAPI from "./TelegramBotAPI.js";
import {
  EMOJI_LIST,
  RESTRICTED_CHATS,
  BOT_USERNAME,
  RANDOM_LEVEL
} from "./constants.js";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN missing");

const tgBot = new TelegramBot(token, { polling: true });
const botApi = new TelegramBotAPI(token);

console.log("Telegram bot polling started");

tgBot.on("message", async (msg) => {
  try {
    await onUpdate(
      { message: msg },      // data
      botApi,                // botApi instance
      EMOJI_LIST,            // Reactions
      RESTRICTED_CHATS,      // Restricted chats
      BOT_USERNAME,          // Bot username
      RANDOM_LEVEL           // Random level
    );
  } catch (e) {
    console.error("Update error:", e);
  }
});
