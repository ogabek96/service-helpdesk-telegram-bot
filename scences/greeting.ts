import Scene from 'telegraf/scenes/base';
const { Extra } = require('telegraf');

const scene = new Scene('greeting');
const menu = Extra
  .markup((m) => m.keyboard([
    m.callbackButton('✅ Оставить заявку')
  ]).resize())

scene.enter(ctx => {
  ctx.reply('Добро пожаловать в HelpDesk «POS Systems»!', menu);
});

scene.command('start', ctx => {
  ctx.scene.enter('greeting');
});

scene.hears('✅ Оставить заявку', ctx => {
  ctx.scene.enter('message');
});

scene.on('message', ctx => {
  ctx.scene.enter('greeting');
});

scene.on('callback_query', ctx => {
  ctx.scene.enter('greeting');
});

export default scene;
