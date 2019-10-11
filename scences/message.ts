const Telegram = require('telegraf/telegram');
const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
const WizardScene = require("telegraf/scenes/wizard");
const { Extra } = require('telegraf');

const cancelKeyboard = Extra
  .markup((m) => m.keyboard([
    m.callbackButton('❌ Отменить заявку')
  ]).resize());

const photoPromptMenu = Extra
  .markup((m) => m.inlineKeyboard([
    m.callbackButton('Без фото', 'no'), m.callbackButton('Прикрепить фото', 'yes')
  ]));

const shareContactKeyboard = Extra.markup((m) => m.keyboard([
  [m.contactRequestButton('Отправить мой номер'), m.callbackButton('❌ Отменить заявку')]
]).resize());

const scene = new WizardScene('message',
  ctx => {
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
  },
  ctx => {
    ctx.session.message.name = ctx.update.message.text;
    ctx.reply('Введите ваш номер телефона или отправьте номер', shareContactKeyboard);
    return ctx.wizard.next();
  },
  ctx => {
    if(ctx.update.message.text) {
      ctx.session.message.phone = ctx.update.message.text;
    } 
    else if(ctx.update.message.contact) {
      ctx.session.message.phone = ctx.update.message.contact.phone_number;
    }
    
    ctx.reply('Введите название вашей компании', cancelKeyboard);
    return ctx.wizard.next();
  },
  ctx => {
    ctx.session.message.company = ctx.update.message.text;
    ctx.reply('Опишите проблему подробно или отправьте голосовое сообщение.', cancelKeyboard);
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.update.message.text) {
      ctx.session.message.description = ctx.update.message.text;
    }
    if (ctx.update.message.voice) {
      ctx.session.message.description = 'Аудиозапись';
      telegram.getFileLink(ctx.update.message.voice.file_id)
        .then(url => {
          console.log(url);
          ctx.session.message.audios.push(url);
        });
    }
    ctx.reply('Прикрепите фото о проблеме', photoPromptMenu);
    return ctx.wizard.next();
  },
  ctx => {
    if (ctx.update.callback_query && ctx.update.callback_query.data === 'yes') {
      return ctx.deleteMessage()
        .then(() => ctx.scene.enter('photo'));
    }
    return ctx.deleteMessage()
      .then(() => ctx.scene.enter('confirm'));
  }
);

scene.hears('❌ Отменить заявку', ctx => {
  ctx.scene.enter('greeting');
});

// scene.on('contact', ctx => {
//   ctx.wizard.cursor = 2;
//   return ctx.wizard.next();
// });

export default scene;
