"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const dotenv = require('dotenv');
var Telegraf = require('telegraf');
var express = require('express');
var expressApp = express();
var RedisSession = require('telegraf-session-redis');
// const session = require('telegraf/session');
var Stage = require('telegraf/stage');
// dotenv.config(); // loading .env file
var URL = process.env.URL;
var PORT = process.env.PORT || 3000;
var BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
var greeting_1 = __importDefault(require("./scences/greeting"));
var message_1 = __importDefault(require("./scences/message"));
var photo_1 = __importDefault(require("./scences/photo"));
var confirm_1 = __importDefault(require("./scences/confirm"));
var bot = new Telegraf(BOT_TOKEN);
bot.telegram.setWebhook(URL + "/bot" + BOT_TOKEN);
expressApp.use(bot.webhookCallback("/bot" + BOT_TOKEN));
var session = new RedisSession({
    store: {
        host: 'redis-17264.c9.us-east-1-4.ec2.cloud.redislabs.com',
        port: '17264',
        database: 'helpdesk',
        password: 'ZHOetj9VT4mtpVF1hRT9mUrol0bXMj6c'
    }
});
var stage = new Stage([greeting_1.default, message_1.default, photo_1.default, confirm_1.default], { default: 'greeting' });
bot.use(session);
bot.use(stage.middleware());
bot.catch(function (err) {
    console.log('Ooops', err);
});
bot.start(function (ctx) {
    ctx.scene.enter('greeting');
});
expressApp.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
// bot.launch()
// .then(() => {
//   console.log('Telegram bot launched');
// });
//# sourceMappingURL=index.js.map