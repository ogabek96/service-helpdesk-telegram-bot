"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("telegraf/scenes/base"));
var Extra = require('telegraf').Extra;
var Telegram = require('telegraf/telegram');
var telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
var scene = new base_1.default('photo');
var sendKeyboard = Extra
    .markup(function (m) { return m.keyboard([
    m.callbackButton('✅ Отправить заявку')
]).resize(); });
scene.enter(function (ctx) {
    ctx.reply('Отправьте несколько фото о проблеме и после, нажмите кнопку Отправить заявку', sendKeyboard);
});
scene.on('photo', function (ctx) {
    var files = ctx.update.message.photo;
    files.sort(compare); // get the biggest image
    return telegram.getFileLink(files[0].file_id)
        .then(function (url) {
        ctx.session.message.photos.push(url);
    });
});
scene.on('document', function (ctx) {
    return ctx.reply('Отправьте только фото, пожалуйста');
});
scene.hears('✅ Отправить заявку', function (ctx) {
    ctx.scene.enter('confirm');
});
function compare(a, b) {
    if (a.file_size > b.file_size) {
        return -1;
    }
    if (a.file_size < b.file_size) {
        return 1;
    }
    return 0;
}
exports.default = scene;
//# sourceMappingURL=photo.js.map