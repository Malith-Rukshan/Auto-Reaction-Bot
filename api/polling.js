import TelegramBot from "node-telegram-bot-api";
import { onUpdate } from "./bot-handler.js";
import TelegramBotAPI from "./TelegramBotAPI.js";
import {
  EMOJI_LIST,
  RESTRICTED_CHATS,
  RANDOM_LEVEL
} from "./constants.js";

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN missing");
}

const tgBot = new TelegramBot(token, { polling: true });
const botApi = new TelegramBotAPI(token);

console.log("Telegram bot polling started");

tgBot.on("message", async (msg) => {
  try {
    await onUpdate(
      { message: msg },                // update data
      botApi,                           // TelegramBotAPI instance
      EMOJI_LIST,                       // reactions
      RESTRICTED_CHATS,                 // restricted chats
      process.env.BOT_USERNAME || "",   // bot username
      RANDOM_LEVEL                      // random level
    );
  } catch (err) {
    console.error("Update error:", err);
  }
});