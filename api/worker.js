/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import TelegramBotAPI from "./TelegramBotAPI.js";
import { htmlContent } from './constants.js';
import { splitEmojis, returnHTML, getChatIds } from "./helper.js";
import { onUpdate } from './bot-handler.js';
import { logger, setLogLevel } from './logger.js';

// Cache for parsed environment variables to avoid repeated parsing
let configCache = null;

function getConfig(env) {
    // Parse environment variables once and cache them
    if (!configCache || configCache.env !== env) {
        // Workers have no process.env, so apply the level from the request env.
        setLogLevel(env.LOG_LEVEL);
        configCache = {
            env: env,
            botToken: env.BOT_TOKEN,
            botUsername: env.BOT_USERNAME,
            reactions: splitEmojis(env.EMOJI_LIST),
            restrictedChats: getChatIds(env.RESTRICTED_CHATS),
            randomLevel: parseInt(env.RANDOM_LEVEL || '0', 10),
            webhookSecret: env.WEBHOOK_SECRET,
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
            // Reject requests that don't carry the secret_token set via setWebhook
            // https://core.telegram.org/bots/api#setwebhook
            if (config.webhookSecret && request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== config.webhookSecret) {
                logger.warn('Rejected webhook request with invalid secret token')
                return new Response('Unauthorized', { status: 401 })
            }

            try {
                const data = await request.json()
                await onUpdate(
                    data,
                    config.botApi,
                    config.reactions,
                    config.restrictedChats,
                    config.botUsername,
                    config.randomLevel
                )
            } catch (error) {
                logger.error('Error in onUpdate:', error.message)
            }
        } else {
            return returnHTML(htmlContent)
        }

        // Return HTTP 200.OK to Telegram
        return new Response('Ok', { status: 200 })
    }
};
