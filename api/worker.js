const TELEGRAM_BOT_TOKEN = "7228651385:AAHvVY9oZAzqoZp2aeProh1i16riopePySM";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

// Array of random reactions
const reactions = [
  "👍", 
  "😂", 
  "🔥", 
  "💯", 
  "😎", 
  "🎉", 
  "👏", 
  "🤩"
];

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Ensure the request is a POST with valid JSON
  if (request.method !== "POST") {
    return new Response("Invalid request method", { status: 405 });
  }
  
  // Parse the incoming update from Telegram
  const update = await request.json();
  
  // Ensure the message is present in the update
  if (update.message && update.message.chat) {
    const chatId = update.message.chat.id;

    // Pick a random reaction from the list
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];

    // Prepare the message body
    const messageBody = {
      chat_id: chatId,
      text: randomReaction
    };

    // Send the reaction back to the Telegram chat
    const response = await fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(messageBody)
    });

    if (response.ok) {
      return new Response("Reaction sent!", { status: 200 });
    } else {
      return new Response("Failed to send reaction", { status: 500 });
    }
  }

  return new Response("No message found", { status: 400 });
}
