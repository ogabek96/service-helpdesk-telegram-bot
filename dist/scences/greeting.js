"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("telegraf/scenes/base"));
var Extra = require('telegraf').Extra;
var scene = new base_1.default('greeting');
var menu = Extra
    .markup(function (m) { return m.keyboard([
    m.callbackButton('✅ Оставить заявку')
]).resize(); });
scene.enter(function (ctx) {
    ctx.reply('Добро пожаловать в HelpDesk «POS Systems»!', menu);
});
scene.command('start', function (ctx) {
    ctx.scene.enter('greeting');
});
scene.hears('✅ Оставить заявку', function (ctx) {
    ctx.scene.enter('message');
});
scene.on('message', function (ctx) {
    ctx.scene.enter('greeting');
});
scene.on('callback_query', function (ctx) {
    ctx.scene.enter('greeting');
});
exports.default = scene;
//# sourceMappingURL=greeting.js.map