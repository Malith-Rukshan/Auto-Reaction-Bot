/*!
 * © [2024] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import TelegramBotAPI from "./TelegramBotAPI.js";
import { htmlContent } from './constants.js';
import { splitEmojis, returnHTML, getChatIds } from "./helper.js";
import { onUpdate } from './bot-handler.js';

export default {
    async fetch(request, env, ctx) {
        // Access the bot token and emoji list from environment variables
        const botToken = env.BOT_TOKEN;
        const botUsername = env.BOT_USERNAME;
        const Reactions = splitEmojis(env.EMOJI_LIST);
        const RestrictedChats = getChatIds(env.RESTRICTED_CHATS);
        const RandomLevel = parseInt(env.RANDOM_LEVEL || '0', 10);

        const botApi = new TelegramBotAPI(botToken);

        if (request.method === 'POST') {
            const data = await request.json()
            try {
                await onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel)
            } catch (error) {
                console.error('Error in onUpdate:', error.message)
            }
        } else {
            return new returnHTML(htmlContent)
        }

        // Return HTTP 200.OK to Telegram
        return new Response('Ok', { status: 200 })
    }
};
