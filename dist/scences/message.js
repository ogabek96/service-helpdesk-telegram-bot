"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Telegram = require('telegraf/telegram');
var telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
var WizardScene = require("telegraf/scenes/wizard");
var Extra = require('telegraf').Extra;
var cancelKeyboard = Extra
    .markup(function (m) { return m.keyboard([
    m.callbackButton('❌ Отменить заявку')
]).resize(); });
var photoPromptMenu = Extra
    .markup(function (m) { return m.inlineKeyboard([
    m.callbackButton('Без фото', 'no'), m.callbackButton('Прикрепить фото', 'yes')
]); });
var shareContactKeyboard = Extra.markup(function (m) { return m.keyboard([
    [m.contactRequestButton('Отправить мой номер'), m.callbackButton('❌ Отменить заявку')]
]).resize(); });
var scene = new WizardScene('message', function (ctx) {
    ctx.reply('Введите ваше имя, пожалуйста', cancelKeyboard);
    ctx.session.message = {
        name: 'Пусто',
        phone: 'Пусто',
        company: 'Пусто',
        description: 'Пусто',
        audios: [],
        photos: []
    };
    return ctx.wizard.next();
}, function (ctx) {
    ctx.session.message.name = ctx.update.message.text;
    ctx.reply('Введите ваш номер телефона или отправьте номер', shareContactKeyboard);
    return ctx.wizard.next();
}, function (ctx) {
    if (ctx.update.message.text) {
        ctx.session.message.phone = ctx.update.message.text;
    }
    else if (ctx.update.message.contact) {
        ctx.session.message.phone = ctx.update.message.contact.phone_number;
    }
    ctx.reply('Введите название вашей компании', cancelKeyboard);
    return ctx.wizard.next();
}, function (ctx) {
    ctx.session.message.company = ctx.update.message.text;
    ctx.reply('Опишите проблему подробно или отправьте голосовое сообщение.', cancelKeyboard);
    return ctx.wizard.next();
}, function (ctx) {
    if (ctx.update.message.text) {
        ctx.session.message.description = ctx.update.message.text;
    }
    if (ctx.update.message.voice) {
        ctx.session.message.description = 'Аудиозапись';
        telegram.getFileLink(ctx.update.message.voice.file_id)
            .then(function (url) {
            console.log(url);
            ctx.session.message.audios.push(url);
        });
    }
    ctx.reply('Прикрепите фото о проблеме', photoPromptMenu);
    return ctx.wizard.next();
}, function (ctx) {
    if (ctx.update.callback_query && ctx.update.callback_query.data === 'yes') {
        return ctx.deleteMessage()
            .then(function () { return ctx.scene.enter('photo'); });
    }
    return ctx.deleteMessage()
        .then(function () { return ctx.scene.enter('confirm'); });
});
scene.hears('❌ Отменить заявку', function (ctx) {
    ctx.scene.enter('greeting');
});
// scene.on('contact', ctx => {
//   ctx.wizard.cursor = 2;
//   return ctx.wizard.next();
// });
exports.default = scene;
//# sourceMappingURL=message.js.map