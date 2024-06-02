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
};