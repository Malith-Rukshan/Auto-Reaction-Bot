const TELEGRAM_BOT_TOKEN = "7228651385:AAHvVY9oZAzqoZp2aeProh1i16riopePySM";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Customizable array of reactions
const defaultReactions = ["👍", "😂", "🔥", "💯", "😎", "🎉", "👏", "🤩"];

// Function to send a reaction back to the chat
async function sendReaction(chatId, reaction) {
  const response = await fetch(TELEGRAM_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: reaction
    })
  });

  if (!response.ok) {
    console.log(`Failed to send reaction to chat ${chatId}`);
  }
}

// Function to handle incoming Telegram updates
async function handleRequest(request) {
  // Ensure this is a POST request with a valid update from Telegram
  if (request.method !== "POST") {
    return new Response("Only POST requests are allowed", { status: 405 });
  }

  // Parse the incoming message from Telegram
  const update = await request.json();

  // Ensure that there is a message and chat ID in the update
  if (!update.message || !update.message.chat || !update.message.chat.id) {
    return new Response("No valid message or chat ID", { status: 400 });
  }

  const chatId = update.message.chat.id;

  // Customizable reactions for different chat types (channels, groups, private chats)
  let reactions = defaultReactions;

  // Customize reactions based on chat type
  if (update.message.chat.type === "group" || update.message.chat.type === "supergroup") {
    reactions = ["🎉", "👏", "🔥", "😂"];
  } else if (update.message.chat.type === "channel") {
    reactions = ["📣", "📝", "👍", "💬"];
  } else if (update.message.chat.type === "private") {
    reactions = ["😊", "👌", "👏"];
  }

  // Randomly select a reaction from the list
  const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

  // Send the reaction back to the chat
  await sendReaction(chatId, randomReaction);

  // Return a response
  return new Response("Reaction sent", { status: 200 });
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
