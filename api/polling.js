import TelegramBotAPI from "./TelegramBotAPI.js";
import {
  EMOJI_LIST,
  RANDOM_LEVEL,
  RESTRICTED_CHATS
} from "./constants.js";
import { shouldReact } from "./helper.js";

/**
 * Main Telegram update handler
 * Compatible with polling + webhook
 */
export default async function botHandler(update, env) {
  if (!update || !update.message) return;

  const message = update.message;
  const chatId = message.chat.id;
  const text = message.text || "";
  const userId = message.from?.id;

  const bot = new TelegramBotAPI(env.BOT_TOKEN);

  /* ───────────────────────────────
     /start command
  ─────────────────────────────── */
  if (text === "/start") {
    await bot.sendMessage(chatId, "🤖 Bot is online and running!");
    return;
  }

  /* ───────────────────────────────
     Restricted chats
  ─────────────────────────────── */
  if (RESTRICTED_CHATS?.includes(String(chatId))) {
    return;
  }

  /* ───────────────────────────────
     Reaction logic
  ─────────────────────────────── */
  if (!shouldReact(RANDOM_LEVEL)) return;

  if (!message.message_id) return;

  const emojis = EMOJI_LIST;
  if (!emojis || emojis.length === 0) return;

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  try {
    await bot.setMessageReaction(chatId, message.message_id, emoji);
  } catch (err) {
    console.error("Reaction failed:", err?.message || err);
  }
}