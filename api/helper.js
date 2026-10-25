import { allowedReactions } from './constants.js';
import { logger } from './logger.js';

// Helper function to select random emoji-reaction
export function getRandomPositiveReaction(reaction) {
    const randomIndex = Math.floor(Math.random() * reaction.length);
    return reaction[randomIndex];
}

// Get Emoji Array from String emoji set
// Splits by grapheme so ZWJ emojis like ❤‍🔥 and 👨‍💻 stay whole, and drops the
// U+FE0F variation selector because Telegram expects e.g. "❤" rather than "❤️".
export function splitEmojis(emojiString) {
    if (!emojiString) return [];
    const emojiRegex = /\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;
    const emojis = [...new Intl.Segmenter().segment(emojiString)]
        .map(({ segment }) => segment.replace(/️/g, ''))
        .filter((segment) => emojiRegex.test(segment));

    const unsupported = emojis.filter((emoji) => !allowedReactions.includes(emoji));
    if (unsupported.length) {
        logger.warn(`EMOJI_LIST contains emojis Telegram doesn't allow as reactions: ${unsupported.join(' ')}`);
    }
    return emojis;
}

// Get Chat IDs from Env | Slipt by `,`
export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

// Helper function to return HTML with correct headers
export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}
