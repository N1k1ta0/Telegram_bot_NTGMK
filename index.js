const TelegramApi = require('node-telegram-bot-api')
const db = require('./db')
const { People } = require('./models/people')
require('dotenv').config()

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true })

const reqPhone = {
  reply_markup: {
    resize_keyboard: true,
    keyboard: [
      [
        {
          text: "Отправить мой номер",
          request_contact: true,
          remove_keyboard: true,
        },
        "Отмена"
      ]
    ]
  }
}

bot.on('polling_error', console.log)
bot.on('message', data => console.log('message - ' + data.text))

bot.onText(/\/start/, msg => {
  // console.log(msg)

  db.authenticate().then(() => {
    console.info('INFO - Database connected.')
    check_id(msg)
  }).catch(err => {
    console.error('ERROR - Unable to connect to the database: ', err.message)
  })
})

bot.once('contact', msg => {
  const phone = msg.contact.phone_number.replace('+', '')
  console.log(phone)
  if (phone.length == 11) check_num(msg.chat.id, phone)
})


function check_id(msg) {
  const chat_id = msg.chat.id
  console.log('chat_id: ' + chat_id)

  People.findOne({ where: { chat_id: chat_id } }).then(data => {
    console.log(data)

    if (data != null) {
      bot.sendMessage(chat_id, 'Добро пожаловать, ' + data.name, reqPhone)
      return
    }

    bot.sendMessage(chat_id, 'Вас нет в списке, отправьте номер ', reqPhone)
  }).catch(console.error)
}

function check_num(chat_id, phone) {
  People.findOne({ where: { phone: phone } }).then(isUnique => {
    console.log(isUnique)

    if (isUnique == null) {
      bot.sendMessage(chat_id, 'Вас нет в списке, обратитесь к администратору')
      return
    }
    
    People.update({
      chat_id: chat_id
    }, {
      where: { phone: phone }
    }).then(i => {
      console.log(i)
    }).catch(error => {
      console.error(error.message)
    })
  }).catch(console.error)
}
