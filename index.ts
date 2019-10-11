const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const express = require('express');
const expressApp = express();
const session = require('telegraf/session');
const Stage = require('telegraf/stage');

dotenv.config(); // loading .env file

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

import greeting from './scences/greeting';
import message from './scences/message';
import photo from './scences/photo';
import confirm from './scences/confirm';


const bot = new Telegraf(BOT_TOKEN);

if (process.env.NODE_ENV === 'prod') {
  bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
  expressApp.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));
}

const stage = new Stage([greeting, message, photo, confirm], { default: 'greeting' });

bot.use(session());
bot.use(stage.middleware());

bot.catch((err) => {
  console.log('Ooops', err)
});

bot.start(ctx => {
  ctx.scene.enter('greeting');
});



if (process.env.NODE_ENV === 'prod') {
  expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
else {
  bot.launch()
    .then(() => {
      console.log('Telegram bot launched');
    });
}
