/*!
 * © [2024] Malith-Rukshan. All rights reserved.
 * Repository: https://github.com/Malith-Rukshan/Auto-Reaction-Bot
 */

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import TelegramBotAPI from './TelegramBotAPI.js';
import { htmlContent } from './constants.js';
import { splitEmojis, getChatIds } from './helper.js';
import { onUpdate } from './bot-handler.js';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const botToken = process.env.BOT_TOKEN;
const botUsername = process.env.BOT_USERNAME;
const Reactions = splitEmojis(process.env.EMOJI_LIST);
const RestrictedChats = getChatIds(process.env.RESTRICTED_CHATS);
const RandomLevel = parseInt(process.env.RANDOM_LEVEL || '0', 10);

const botApi = new TelegramBotAPI(botToken);

app.post('/', async (req, res) => {
    const data = req.body;
    try {
        await onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel);
        res.status(200).send('Ok');
    } catch (error) {
        console.error('Error in onUpdate:', error.message);
        res.status(200).send('Ok');
    }
});

app.get('/', (req, res) => {
    res.send(htmlContent);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
