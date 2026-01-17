import TelegramBot from "node-telegram-bot-api";
import { onUpdate } from "./bot-handler.js";
import TelegramBotAPI from "./TelegramBotAPI.js";
import * as CONSTANTS from "./constants.js";

const { EMOJI_LIST, RESTRICTED_CHATS, RANDOM_LEVEL } = CONSTANTS;

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
      { message: msg },
      botApi,
      EMOJI_LIST,
      RESTRICTED_CHATS,
      process.env.BOT_USERNAME || "",
      RANDOM_LEVEL
    );
  } catch (err) {
    console.error("Update error:", err);
  }
});