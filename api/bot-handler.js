/*!
 * © [2026] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import { startMessage, donateMessage } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

/**
 * Handle incoming Telegram Update
 * https://core.telegram.org/bots/api#update
 *
 * @param {Object} data - Telegram update object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {Array} Reactions - Array of emoji reactions
 * @param {Array} RestrictedChats - Array of restricted chat IDs
 * @param {string} botUsername - Bot username
 * @param {number} RandomLevel - Random level for group reactions (0-10)
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {
    let chatId, message_id, text;

    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        chatId = content.chat.id;
        message_id = content.message_id;
        text = content.text;

        // Normalize commands addressed to this bot, e.g. "/reactions@BotName" -> "/reactions"
        if (text && botUsername) {
            text = text.replace(new RegExp(`^(/\\w+)@${botUsername}\\b`, 'i'), '$1');
        }

        if (data.message && content.successful_payment) {
            await botApi.sendMessage(chatId, "Thank you for your donation! 💝");
        } else if (data.message && text === '/start') {
            await botApi.sendMessage(chatId, startMessage.replace('UserName', content.chat.type === "private" ? content.from.first_name : content.chat.title), [
                [
                    { "text": "➕ Add to Channel ➕", "url": `https://t.me/${botUsername}?startchannel=botstart` },
                    { "text": "➕ Add to Group ➕", "url": `https://t.me/${botUsername}?startgroup=botstart` },
                ],
                [
                    { "text": "Github Source 📥", "url": "https://github.com/Malith-Rukshan/Auto-Reaction-Bot" },
                ],
                [
                    { "text": "💝 Support Us - Donate 🤝", "url": "https://t.me/Auto_ReactionBOT?start=donate" }
                ]
            ]);
        } else if (data.message && text === '/reactions') {
            const reactions = Reactions.join(", ");
            await botApi.sendMessage(chatId, "✅ Enabled Reactions : \n\n" + reactions);
        } else if (data.message && (text === '/donate' || text === '/start donate')) {
            await botApi.sendInvoice(
                chatId,
                "Donate to Auto Reaction Bot ✨",
                donateMessage,
                '{}',
                'donate',
                'XTR',
                [{ label: 'Pay ⭐️5', amount: 5 }],
            )
        } else {
            // Calculate the threshold: higher RandomLevel, lower threshold
            let threshold = 1 - (RandomLevel / 10);
            if (Reactions.length && !RestrictedChats.includes(chatId)) {
                // Check if chat is a group or supergroup to determine if reactions should be random
                if (["group", "supergroup"].includes(content.chat.type)) {
                    // Run Function Randomly - According to the RANDOM_LEVEL
                    if (Math.random() <= threshold) {
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                } else {
                    // For non-group chats, set the reaction directly
                    await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                }
            }
        }
    } else if (data.pre_checkout_query) {
        // Thank-you message is sent once the payment completes (successful_payment above)
        await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
    }
}
