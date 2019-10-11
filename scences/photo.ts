import Scene from 'telegraf/scenes/base';
const { Extra } = require('telegraf');
const Telegram = require('telegraf/telegram');

const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);

const scene = new Scene('photo');

const sendKeyboard = Extra
  .markup((m) => m.keyboard([
    m.callbackButton('✅ Отправить заявку')
  ]).resize());

scene.enter(ctx => {
  ctx.reply('Отправьте несколько фото о проблеме и после, нажмите кнопку Отправить заявку', sendKeyboard);
});

scene.on('photo', ctx => {
  const files = ctx.update.message.photo;
  files.sort(compare); // get the biggest image
  return telegram.getFileLink(files[0].file_id)
    .then(url => {
      ctx.session.message.photos.push(url);
    });
});

scene.on('document', ctx => {
  return ctx.reply('Отправьте только фото, пожалуйста');
});

scene.hears('✅ Отправить заявку', ctx => {
  ctx.scene.enter('confirm');
});

function compare( a, b ) {
  if ( a.file_size > b.file_size ){
    return -1;
  }
  if ( a.file_size < b.file_size ){
    return 1
  }
  return 0;
}

export default scene;
