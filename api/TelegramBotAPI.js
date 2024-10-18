/**
 * Telegram API for: 
 *      - sendMessage
 *      - setMessageReaction
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */
import fetch from 'node-fetch';

export default class TelegramBotAPI {
    constructor(botToken) {
        this.apiUrl = `https://api.telegram.org/bot${botToken}/`;
    }

    async callApi(action, body) {
        const response = await fetch(this.apiUrl + action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(`Telegram API request failed: ${action}`, data);
            throw new Error('Telegram API request failed: ' + action);
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