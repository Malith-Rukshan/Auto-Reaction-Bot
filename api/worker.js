/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import TelegramBotAPI from "./TelegramBotAPI.js";
import { htmlContent } from './constants.js';
import { splitEmojis, returnHTML, getChatIds } from "./helper.js";
import { onUpdate } from './bot-handler.js';

// Cache for parsed environment variables to avoid repeated parsing
let configCache = null;

function getConfig(env) {
    // Parse environment variables once and cache them
    if (!configCache || configCache.env !== env) {
        configCache = {
            env: env,
            botToken: env.BOT_TOKEN,
            botUsername: env.BOT_USERNAME,
            reactions: splitEmojis(env.EMOJI_LIST),
            restrictedChats: getChatIds(env.RESTRICTED_CHATS),
            randomLevel: parseInt(env.RANDOM_LEVEL || '0', 10),
            botApi: new TelegramBotAPI(env.BOT_TOKEN)
        };
    }
    return configCache;
}

export default {
    async fetch(request, env) {
        // Parse environment variables once at startup
        const config = getConfig(env);
        const url = new URL(request.url);

        // Health check endpoint
        if (url.pathname === '/health' && request.method === 'GET') {
            return new Response(JSON.stringify({
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV || 'production',
                botConfigured: !!config.botToken && !!config.botUsername
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (request.method === 'POST') {
            const data = await request.json()
            try {
                await onUpdate(
                    data,
                    config.botApi,
                    config.reactions,
                    config.restrictedChats,
                    config.botUsername,
                    config.randomLevel
                )
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
