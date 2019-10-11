import axios from 'axios';
const uuidv4 = require('uuid/v4');
import Scene from 'telegraf/scenes/base';
const { Extra } = require('telegraf');

const scene = new Scene('confirm');

const menu = Extra
  .markup((m) => m.keyboard([
    m.callbackButton('✅ Подтвердить'), m.callbackButton('❌ Отменить')
  ]).resize());

scene.enter(ctx => {
  // // This is for removing keyboard
  // ctx.reply('.', Extra.markup((m) => m.removeKeyboard()))
  //   .then((mes) => {
  //     return ctx.deleteMessage(mes.message_id);
  //   });

  ctx.replyWithHTML(`<b>Подтвердите данные</b>: \nИмя: ${ctx.session.message.name} \nТелефон: ${ctx.session.message.phone} \nОрганизация: ${ctx.session.message.company} \nСообщения: ${ctx.session.message.description} \nФото: ${ctx.session.message.photos.length} фото: `, menu)
});

scene.on('message', ctx => {
  if (ctx.update.message.text === '✅ Подтвердить') {
    const description = `
    Имя: ${ctx.session.message.name}
    Телефон: ${ctx.session.message.phone}
    Компания: ${ctx.session.message.company} \n
    Описание:  ${ctx.session.message.description}`;

    const currentDate = new Date();
    currentDate.setHours(17, 0, 0);

    const promises: Promise<void>[] = [];
    const imageIds: String[] = [];

    ctx.session.message.photos.forEach(url => {
      promises.push(
        getBase64(url)
          .then((base64Data) => {
            return axios
              .post(
                `https://posuz.bitrix24.ru/rest/1/${process.env.BITRIX_WEBHOOK_TOKEN}/disk.storage.uploadfile`,
                {
                  id: 63,
                  data: {
                    NAME: uuidv4() + '.' + getExtenstionFromUrl(url)
                  },
                  fileContent: base64Data
                }
              )
              .then(res => {
                imageIds.push('n' + res.data.result.ID);
              })
          })
      );
    });

    ctx.session.message.audios.forEach(url => {
      promises.push(
        getBase64(url)
          .then((base64Data) => {
            return axios
              .post(
                `https://posuz.bitrix24.ru/rest/1/${process.env.BITRIX_WEBHOOK_TOKEN}/disk.storage.uploadfile`,
                {
                  id: 63,
                  data: {
                    NAME: uuidv4() + '.' + getExtenstionFromUrl(url)
                  },
                  fileContent: base64Data
                }
              )
              .then(res => {
                console.log(res.data);
                imageIds.push('n' + res.data.result.ID);
              })
          })
      );
    });
    
    Promise.all(promises)
      .then(() => {
        return axios.post(`https://posuz.bitrix24.ru/rest/1/${process.env.BITRIX_WEBHOOK_TOKEN}/tasks.task.add`,
          {
            fields: {
              TITLE: `[${ctx.session.message.name}] [${ctx.session.message.company}] [${ctx.session.message.phone}]`,
              DESCRIPTION: description,
              RESPONSIBLE_ID: 1,
              ACCOMPLICES: ['7'],
              CREATED_BY: 29,
              GROUP_ID: 27,
              UF_TASK_WEBDAV_FILES: imageIds,
              DEADLINE: currentDate
            }
          })
      })

    ctx.reply('Ваша заявка принята.')
      .then(() => ctx.scene.enter('greeting'));

  } else {
    ctx.scene.enter('greeting');
  }

});


function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

function getExtenstionFromUrl(url) {
  const split = url.split('.');
  const len = split.length;
  return split[len - 1];
}

export default scene;
