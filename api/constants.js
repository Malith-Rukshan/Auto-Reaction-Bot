export const startMessage = `👋 Hello there, UserName !

Welcome to the *Auto Emoji Reaction Bot 🎉*, ready to sprinkle your conversations with a little extra happiness!

💁‍♂️ Here's how I spice up your chats:

*✨ DM Magic*: Message me and receive a surprise emoji in return. Expect the unexpected and enjoy the fun!
*🏖 Group & Channel*: Add me to your groups or channels, and I'll keep the vibe positive by reacting to messages with engaging emojis.

✍️ To view the emojis I can use, simply type /reactions. To create your own auto reaction bot, head over to: [Auto-Reaction-Bot on GitHub](https://github.com/Malith-Rukshan/Auto-Reaction-Bot).

Let's elevate our conversations with more energy and color! 🚀

💖 Keep us running! Support the bot: /donate`

export const donateMessage = `🙏 Support Auto Reaction Bot ✨ and help us stay online and continue to improve! ✨ Your donations keep our services live and enable us to bring you new features and enhancements. Every star makes a difference! Thank you! 🌟🚀`

// Emoji reactions bots are allowed to set (Bot API 10.3)
// https://core.telegram.org/bots/api#reactiontypeemoji
export const allowedReactions = [
    "❤", "👍", "👎", "🔥", "🥰", "👏", "😁", "🤔", "🤯", "😱", "🤬", "😢", "🎉", "🤩", "🤮", "💩",
    "🙏", "👌", "🕊", "🤡", "🥱", "🥴", "😍", "🐳", "❤‍🔥", "🌚", "🌭", "💯", "🤣", "⚡", "🍌", "🏆",
    "💔", "🤨", "😐", "🍓", "🍾", "💋", "🖕", "😈", "😴", "😭", "🤓", "👻", "👨‍💻", "👀", "🎃", "🙈",
    "😇", "😨", "🤝", "✍", "🤗", "🫡", "🎅", "🎄", "☃", "💅", "🤪", "🗿", "🆒", "💘", "🙉", "🦄",
    "😘", "💊", "🙊", "😎", "👾", "🤷‍♂", "🤷", "🤷‍♀", "😡"
];

export const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Telegram Auto Reaction Bot</title>
<meta name="description" content="Single Developers presents an open-source Telegram Auto Reaction bot developed by Malith-Rukshan. Reacts to all messages received from chats automatically. Serverless deployment on Cloudflare.">
<meta name="keywords" content="Telegram bot, auto reaction bot, open-source, Single Developers, Malith-Rukshan, Telegram auto reaction, serverless telegram bot, reaction automation">
<script async defer src="https://buttons.github.io/buttons.js"></script>
<style>
  body, html {
    height: 100%; margin: 0; display: flex; justify-content: center; align-items: center; flex-direction: column; font-family: Arial, sans-serif;
  }
  .logo {
    width: 60%; margin-bottom: 20px;
  }
  .title { margin-bottom: 20px; font-size: 34px; font-weight: bold; color: #333; text-align: center; }
  .button {
    padding: 10px 20px; margin: 10px; font-size: 16px; cursor: pointer; text-align: center; color: #fff; border: none; border-radius: 15px;
    transition: background-color 0.3s ease; display: inline-block; outline: none;
  }
  .githubBtn { background-color: #0881FD; }
  .githubBtn:hover { background-color: #0672E0; }
</style>
</head>
<body>

<div class="title">Telegram Auto Reaction Bot 🎉</div>
<img class="logo" src="https://telegra.ph/file/cb59967120c6bda64580b.jpg">

<button class="button githubBtn" onclick="window.location='https://github.com/Malith-Rukshan/Auto-Reaction-Bot'">Open Source 🌱</button>

<div style="margin: 5px;">
  <a class="github-button" href="https://github.com/Malith-Rukshan/Auto-Reaction-Bot" data-size="large" data-show-count="true">Star</a>
  <a class="github-button" href="https://github.com/Malith-Rukshan/Auto-Reaction-Bot/fork" data-size="large" data-show-count="true">Fork</a>
</div>
<div>
  <a class="github-button" href="https://github.com/Malith-Rukshan" data-size="large">Follow @Malith-Rukshan</a>
</div>
</body>
</html>
`;

