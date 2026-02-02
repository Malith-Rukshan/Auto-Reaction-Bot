/**
 * Telegram API for:
 *      - sendMessage
 *      - setMessageReaction
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

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
                // Log error with action and relevant request details
                console.error(`Telegram API request failed: ${action} (Status: ${response.status})`);

                // Log only relevant fields based on action
                if (action === 'setMessageReaction') {
                    console.error(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (action === 'sendMessage') {
                    console.error(`Chat ID: ${body.chat_id}, Text: ${body.text?.substring(0, 50)}...`);
                } else if (action === 'sendInvoice') {
                    console.error(`Chat ID: ${body.chat_id}, Title: ${body.title}`);
                } else if (action === 'answerPreCheckoutQuery') {
                    console.error(`Pre-checkout Query ID: ${body.pre_checkout_query_id}, OK: ${body.ok}`);
                } else {
                    console.error(`Chat ID: ${body.chat_id || 'N/A'}`);
                }

                if (data.description) {
                    console.error(`Error description: ${data.description}`);
                }
                if (data.error_code) {
                    console.error(`Error code: ${data.error_code}`);
                }

                throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
            }

            return data;

        } catch (error) {
            // Log network/timeout errors with action and relevant details
            if (error.name === 'AbortError') {
                console.error(`Request timeout for action: ${action}`);
                if (action === 'setMessageReaction') {
                    console.error(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (body.chat_id) {
                    console.error(`Chat ID: ${body.chat_id}`);
                }
                throw new Error(`Telegram API timeout: ${action}`);
            } else if (!error.message.includes('Telegram API error')) {
                console.error(`Network error for action: ${action}`);
                if (action === 'setMessageReaction') {
                    console.error(`Chat ID: ${body.chat_id}, Message ID: ${body.message_id}, Reaction: ${body.reaction?.[0]?.emoji}`);
                } else if (body.chat_id) {
                    console.error(`Chat ID: ${body.chat_id}`);
                }
                console.error(`Error message: ${error.message}`);
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