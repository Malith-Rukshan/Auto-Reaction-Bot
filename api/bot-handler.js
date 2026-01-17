/**
 * Handles incoming Telegram updates
 */
export async function onUpdate(
  data,
  botApi,
  Reactions,
  RestrictedChats,
  botUsername,
  RandomLevel
) {
  if (!data || !data.message) return;

  const msg = data.message;
  const chatId = msg.chat?.id;
  const messageId = msg.message_id;
  const text = msg.text || "";

  if (!chatId) return;

  /* /start command */
  if (text === "/start") {
    await botApi.sendMessage(chatId, "✅ Bot is online");
    return;
  }

  /* Restricted chats */
  if (RestrictedChats?.includes(String(chatId))) {
    return;
  }

  /* Random reaction chance */
  if (RandomLevel && Math.floor(Math.random() * RandomLevel) !== 0) {
    return;
  }

  if (!Array.isArray(Reactions) || Reactions.length === 0) return;
  if (!messageId) return;

  const emoji =
    Reactions[Math.floor(Math.random() * Reactions.length)];

  try {
    await botApi.setMessageReaction(chatId, messageId, emoji);
  } catch (err) {
    console.error("Reaction failed:", err?.message || err);
  }
}