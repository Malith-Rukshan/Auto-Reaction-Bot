/*!
 * © [2024] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import TelegramBotAPI from "./TelegramBotAPI.js";
import { htmlContent, startMessage, donateMessage } from './constants.js';
import { splitEmojis, returnHTML, getRandomPositiveReaction, getChatIds} from "./helper.js";

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
                await this.onUpdate(data, botApi, Reactions,RestrictedChats, botUsername, RandomLevel)
            } catch (error) {
                console.log(error)
            }
        } else {
            return new returnHTML(htmlContent)
            //return new Response('Method not supported', { status: 405 });
        }

        // Return HTTP 200.OK to Telegram
        return new Response('Ok', { status: 200 })
    },

    /**
     * Handle incoming Update
     * https://core.telegram.org/bots/api#update
     */
    async onUpdate(data, botApi, Reactions,RestrictedChats, botUsername, RandomLevel) {
        let chatId, message_id, text;

        if (data.message || data.channel_post) {
            const content = data.message || data.channel_post;
            chatId = content.chat.id;
            message_id = content.message_id;
            text = content.text;

            if (data.message && (text === '/start' || text === '/start@'+ botUsername )) {
                await botApi.sendMessage(chatId, startMessage.replace('UserName', content.chat.type === "private" ? content.from.first_name : content.chat.title),
				[
					[
                        {"text": "➕ Add to Channel ➕", "url": `https://t.me/${botUsername}?startchannel=botstart`},
						{"text": "➕ Add to Group ➕", "url": `https://t.me/${botUsername}?startgroup=botstart`},
					],
                    [
                        {"text": "Github Source 📥", "url": "https://github.com/Malith-Rukshan/Auto-Reaction-Bot"},
                    ],
                    [
                        { "text": "💝 Support Us - Donate 🤝", "url": "https://t.me/Auto_ReactionBOT?start=donate" }
                    ]
				]
				);
            } else 
			if (data.message && text === '/reactions') {
				const reactions = Reactions.join(", ");
				await botApi.sendMessage(chatId, "✅ Enabled Reactions : \n\n" + reactions);
			} else if (data.message && text === '/donate' || text === '/start donate') {
                await botApi.sendInvoice(
                    chatId,
                    "Donate to Auto Reaction Bot ✨",
                    donateMessage,
                    '{}',
                    '',
                    'donate',
                    'XTR',
                    [{ label: 'Pay ⭐️1', amount: 1 }],
                )
            } else {
                // Calculate the threshold: higher RandomLevel, lower threshold
                let threshold = 1 - (RandomLevel / 10);
                if (!RestrictedChats.includes(chatId)) {
                    // Check if chat is a group or supergroup to determine if reactions should be random
                    if (["group", "supergroup"].includes(content.chat.type)) {
                        // Run Function Randomly - Accroding to the RANDOM_LEVEL
                        if (Math.random() <= threshold) {
                            await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                        }
                    } else {
                        // For non-group chats, set the reaction directly
                        await botApi.setMessageReaction(chatId, message_id, getRandomPositiveReaction(Reactions));
                    }
                }
            }
        } else if (data.pre_checkout_query){
            await botApi.answerPreCheckoutQuery(data.pre_checkout_query.id, true);
            await botApi.sendMessage(data.pre_checkout_query.from.id, "Thank you for your donation! 💝");
        }
    }
};
