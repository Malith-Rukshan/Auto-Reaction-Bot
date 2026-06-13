/**
 * Telegram API for:
 *      - sendMessage
 *      - setMessageReaction
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import { logger } from './logger.js';

export default class TelegramBotAPI {
    constructor(botToken) {
        this.apiUrl = `https://api.telegram.org/bot${botToken}/`;
    }

    async callApi(action, body) {
        try {
            const response = await fetch(this.apiUrl + action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            const data = await response.json();

            if (!response.ok) {
                // One concise summary line at warn level; the bot recovers from
                // these gracefully, so the per-request details go to debug.
                logger.warn(`Telegram API request failed: ${action} (Status: ${response.status})${data.description ? ' - ' + data.description : ''}`);

                // Log only relevant fields based on action
                if (action === 'setMessageReaction') {
                    logger.debug(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (action === 'sendMessage') {
                    logger.debug(`Chat ID: ${body.chat_id}, Text: ${body.text?.substring(0, 50)}...`);
                } else if (action === 'sendInvoice') {
                    logger.debug(`Chat ID: ${body.chat_id}, Title: ${body.title}`);
                } else if (action === 'answerPreCheckoutQuery') {
                    logger.debug(`Pre-checkout Query ID: ${body.pre_checkout_query_id}, OK: ${body.ok}`);
                } else {
                    logger.debug(`Chat ID: ${body.chat_id || 'N/A'}`);
                }

                if (data.error_code) {
                    logger.debug(`Error code: ${data.error_code}`);
                }

                throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
            }

            return data;

        } catch (error) {
            // Log network/timeout errors with action and relevant details
            if (error.name === 'AbortError') {
                logger.warn(`Request timeout for action: ${action}`);
                if (action === 'setMessageReaction') {
                    logger.debug(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (body.chat_id) {
                    logger.debug(`Chat ID: ${body.chat_id}`);
                }
                throw new Error(`Telegram API timeout: ${action}`);
            } else if (!error.message.includes('Telegram API error')) {
                logger.warn(`Network error for action: ${action} - ${error.message}`);
                if (action === 'setMessageReaction') {
                    logger.debug(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (body.chat_id) {
                    logger.debug(`Chat ID: ${body.chat_id}`);
                }
                throw new Error(`Network error: ${action}`);
            }

            throw error;
        }
    }

    /**
     * https://core.telegram.org/bots/api#setmessagereaction
     * @param {number} chatId 
     * @param {number} messageId 
     * @param {string} emoji 
     */
    async setMessageReaction(chatId, messageId, emoji) {
        await this.callApi('setMessageReaction', {
            chat_id: chatId,
            message_id: messageId,
            reaction: [{
                type: 'emoji',
                emoji: emoji
            }],
            is_big: true
        });
    }

    /**
     * https://core.telegram.org/bots/api#sendmessage
     * @param {number} chatId 
     * @param {string} text 
     */
    async sendMessage(chatId, text, inlineKeyboard = null) {
        await this.callApi('sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: "Markdown",
            disable_web_page_preview:true,
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
        });
    } 
    
    /**
     * https://core.telegram.org/bots/api#sendinvoice
     * @param {number} params.chatId - Unique identifier for the target chat
     * @param {string} params.title - Product name
     * @param {string} params.description - Product description
     * @param {string} params.payload - Bot-defined invoice payload
     * @param {string} params.providerToken - Payments provider token
     * @param {string} params.startParameter - Unique deep-linking parameter
     * @param {string} params.currency - Three-letter ISO 4217 currency code
     * @param {Array} params.prices - Price breakdown (e.g., [{label: 'Product', amount: 1000}])
     */
    async sendInvoice(chatId, title, description, payload, providerToken, startParameter, currency, prices) {
        await this.callApi('sendInvoice', {
            chat_id: chatId,
            title: title,
            description: description,
            payload: payload,
            provider_token: providerToken,
            start_parameter: startParameter,
            currency: currency,
            prices: prices
        });
    }

    /**
     * https://core.telegram.org/bots/api#answerprecheckoutquery
     * @param {string} preCheckoutQueryId - Unique identifier for the query to be answered
     * @param {boolean} ok - Specify if the query was successful
     */
    async answerPreCheckoutQuery(preCheckoutQueryId, ok) {
        await this.callApi('answerPreCheckoutQuery', {
            pre_checkout_query_id: preCheckoutQueryId,
            ok: ok
        });
    }
};