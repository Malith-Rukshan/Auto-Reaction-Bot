addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const token = TELEGRAM_BOT_TOKEN;  // Set this in your secrets
  const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const data = {
    chat_id: "<CHAT_ID>",  // Replace with actual chat ID or handle dynamically
    text: "👍 This is an auto-reaction!"
  };

  const response = await fetch(telegramApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    return new Response("Error posting to Telegram", { status: 500 });
  }

  return new Response("Message posted!", { status: 200 });
}
