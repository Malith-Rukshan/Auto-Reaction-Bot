// Helper function to select random emoji-reaction
export function getRandomPositiveReaction(reaction) {
    const randomIndex = Math.floor(Math.random() * reaction.length);
    return reaction[randomIndex];
}

// Get Emoji Array from String emoji set
export function splitEmojis(emojiString) {
    if (!emojiString) return [];
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\p{Emoji_Modifier_Base})/gu;
    return emojiString.match(emojiRegex) || [];
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