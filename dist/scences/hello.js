"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("telegraf/scenes/base"));
var scene = new base_1.default('hello');
scene.enter(function (ctx) {
    ctx.reply('Entered scene hello');
});
scene.leave(function (ctx) {
    ctx.reply('Left hello scene');
});
scene.hears('leave', function (ctx) {
    return ctx.scene.leave();
});
exports.default = scene;
//# sourceMappingURL=hello.js.map