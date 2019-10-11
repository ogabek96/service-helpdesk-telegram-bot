"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var uuidv4 = require('uuid/v4');
var base_1 = __importDefault(require("telegraf/scenes/base"));
var Extra = require('telegraf').Extra;
var scene = new base_1.default('confirm');
var menu = Extra
    .markup(function (m) { return m.keyboard([
    m.callbackButton('✅ Подтвердить'), m.callbackButton('❌ Отменить')
]).resize(); });
scene.enter(function (ctx) {
    // // This is for removing keyboard
    // ctx.reply('.', Extra.markup((m) => m.removeKeyboard()))
    //   .then((mes) => {
    //     return ctx.deleteMessage(mes.message_id);
    //   });
    ctx.replyWithHTML("<b>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</b>: \n\u0418\u043C\u044F: " + ctx.session.message.name + " \n\u0422\u0435\u043B\u0435\u0444\u043E\u043D: " + ctx.session.message.phone + " \n\u041E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u044F: " + ctx.session.message.company + " \n\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F: " + ctx.session.message.description + " \n\u0424\u043E\u0442\u043E: " + ctx.session.message.photos.length + " \u0444\u043E\u0442\u043E: ", menu);
});
scene.on('message', function (ctx) {
    if (ctx.update.message.text === '✅ Подтвердить') {
        var description_1 = "\n    \u0418\u043C\u044F: " + ctx.session.message.name + "\n    \u0422\u0435\u043B\u0435\u0444\u043E\u043D: " + ctx.session.message.phone + "\n    \u041A\u043E\u043C\u043F\u0430\u043D\u0438\u044F: " + ctx.session.message.company + " \n\n    \u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435:  " + ctx.session.message.description;
        var currentDate_1 = new Date();
        currentDate_1.setHours(17, 0, 0);
        var promises_1 = [];
        var imageIds_1 = [];
        ctx.session.message.photos.forEach(function (url) {
            promises_1.push(getBase64(url)
                .then(function (base64Data) {
                return axios_1.default
                    .post('https://posuz.bitrix24.ru/rest/1/x57g8x27lg0q07sh/disk.storage.uploadfile', {
                    id: 63,
                    data: {
                        NAME: uuidv4() + '.' + getExtenstionFromUrl(url)
                    },
                    fileContent: base64Data
                })
                    .then(function (res) {
                    imageIds_1.push('n' + res.data.result.ID);
                });
            }));
        });
        ctx.session.message.audios.forEach(function (url) {
            promises_1.push(getBase64(url)
                .then(function (base64Data) {
                return axios_1.default
                    .post('https://posuz.bitrix24.ru/rest/1/x57g8x27lg0q07sh/disk.storage.uploadfile', {
                    id: 63,
                    data: {
                        NAME: uuidv4() + '.' + getExtenstionFromUrl(url)
                    },
                    fileContent: base64Data
                })
                    .then(function (res) {
                    console.log(res.data);
                    imageIds_1.push('n' + res.data.result.ID);
                });
            }));
        });
        Promise.all(promises_1)
            .then(function () {
            return axios_1.default.post('https://posuz.bitrix24.ru/rest/1/x57g8x27lg0q07sh/tasks.task.add', {
                fields: {
                    TITLE: "[" + ctx.session.message.name + "] [" + ctx.session.message.company + "] [" + ctx.session.message.phone + "]",
                    DESCRIPTION: description_1,
                    RESPONSIBLE_ID: 1,
                    ACCOMPLICES: ['7'],
                    CREATED_BY: 29,
                    GROUP_ID: 27,
                    UF_TASK_WEBDAV_FILES: imageIds_1,
                    DEADLINE: currentDate_1
                }
            });
        });
        ctx.reply('Ваша заявка принята.')
            .then(function () { return ctx.scene.enter('greeting'); });
    }
    else {
        ctx.scene.enter('greeting');
    }
});
function getBase64(url) {
    return axios_1.default
        .get(url, {
        responseType: 'arraybuffer'
    })
        .then(function (response) { return Buffer.from(response.data, 'binary').toString('base64'); });
}
function getExtenstionFromUrl(url) {
    var split = url.split('.');
    var len = split.length;
    return split[len - 1];
}
exports.default = scene;
//# sourceMappingURL=confirm.js.map