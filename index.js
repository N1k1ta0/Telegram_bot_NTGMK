const TelegramApi = require('node-telegram-bot-api')
const db = require('./db')
const { People } = require('./models/people')
const { CommonInformation } = require('./models/common_information')
const { Rating } = require('./models/rating')
const { Contracts } = require('./models/contracts')
const { Orders } = require('./models/orders')
// const { Informations } = require('./models/informations')
const { Schedule } = require('./models/schedules')
const { RatingParsing } = require('./src/RatingParsing')
require('dotenv').config()

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true })

const menuKeyboard = {
  reply_markup: {
    keyboard: [
      ["Общая информация"],
      [
        "Расписание",
        "Успеваемость"
      ],
      [
        "Договоры",
        "Приказы"
      ],
      ["Заказ справок"]
    ]
  }
}

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
// bot.on('message', data => console.log('message - ' + data.text))

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

bot.onText(/Общая информация/, msg => {
  People.findOne({
    include: {
      model: CommonInformation
    },
    where: {
      chat_id: msg.chat.id
    }
  }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Ошибка', menuKeyboard)
      return
    }

    let content = `${msg.text}
    Студент: ${msg.chat.username}
    Группа: ${data.common_information.group}
    Специальность: ${data.common_information.speciality}
    Отделение: ${data.common_information.department}
    Организация: ${data.common_information.oganization}
    Форма обучения: ${data.common_information.form_education}
    Номер зачётки: ${data.common_information.zachetka}
    Номер студенческого билета: ${data.common_information.student_id}`
  
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  }).catch(console.error)
})

bot.onText(/Расписание/, msg => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timezone: 'UTC'
  }

  People.findOne({
    include: {
      model: Schedule
    },
    where: {
      chat_id: msg.chat.id
    }
  }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Ошибка', menuKeyboard)
      return
    }

    let content = `${msg.text}
    ${new Date().toLocaleString('ru', options)}\n`
    data.schedules.forEach(s => content += `
    Пара №${s.lesson_number}
    ${s.lesson}
    ${s.teacher}, ${s.room_number}\n`)
  
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  }).catch(console.error)
})

bot.onText(/Успеваемость|\/ratings/, msg => {
  let content = 'Успеваемость\n'

  RatingParsing().then(rating => {
    // console.log(rating)
    rating.forEach(l => content += `
${l[3]} курс ${l[4]} сем.
${l[0]} ${l[2]}
${l[3] ? l[3] : '-'}\n`)
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  })
  return

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC'
  }

  People.findOne({
    include: {
      model: Rating
    },
    where: {
      chat_id: msg.chat.id
    }
  }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Ошибка', menuKeyboard)
      return
    }

    let content = `${msg.text}
    1 семестр\n`
    data.ratings.forEach(l => content += `
    ${new Date(l.date).toLocaleString('ru', options)}
    ${l.name} (${l.type})
    ${l.status}\n`)
  
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  }).catch(console.error)
})

bot.onText(/Договоры/, msg => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC'
  }

  People.findOne({
    include: {
      model: Contracts
    },
    where: {
      chat_id: msg.chat.id
    }
  }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Ошибка', menuKeyboard)
      return
    }

    let content = `Ваш действующий контракт:
    Организация: ${data.contract.name}
    Специальность: ${data.contract.speciality}
    Дата начала: ${new Date(data.contract.start_date).toLocaleString('ru', options)}
    Дата окончания: ${new Date(data.contract.finish_date).toLocaleString('ru', options)}
    Период оплаты: ${data.contract.period}
    Стоимость за период: ${data.contract.price} руб.`
  
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  }).catch(console.error)
})

bot.onText(/Приказы/, msg => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC'
  }
  
  People.findOne({
    include: {
      model: Orders
    },
    where: {
      chat_id: msg.chat.id
    }
  }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Ошибка', menuKeyboard)
      return
    }

    let content = `Ваши приказы:\n`
    data.orders.forEach(o => content += `
    ${new Date(o.date).toLocaleString('ru', options)} - ${o.status}
    ${o.group} (${o.user_status})\n`)
  
    bot.sendMessage(msg.chat.id, content, menuKeyboard)
  }).catch(console.error)
})

bot.onText(/Заказ справок/, msg => {
  let content = `Перейдите по ссылке, чтобы заказать справку:
  http://ntgmk.ru/program/zapros.php`

  bot.sendMessage(msg.chat.id, content, menuKeyboard)
})


function check_id(msg) {
  const chat_id = msg.chat.id
  console.log('chat_id: ' + chat_id)

  People.findOne({ where: { chat_id: chat_id } }).then(data => {
    // console.log(data)

    if (data != null) {
      bot.sendMessage(chat_id, 'Добро пожаловать, ' + data.name, menuKeyboard)
      return
    }

    bot.sendMessage(chat_id, 'Вас нет в списке, отправьте номер ', reqPhone)
  }).catch(console.error)
}

function check_num(chat_id, phone) {
  People.findOne({ where: { phone: phone } }).then(data => {
    // console.log(data)

    if (data == null) {
      bot.sendMessage(chat_id, 'Вас нет в списке, обратитесь к администратору')
      return
    }
    
    People.update({
      chat_id: chat_id
    }, {
      where: { phone: phone }
    }).then(i => {
      console.log(i)
      bot.sendMessage(chat_id, 'Добро пожаловать, ' + data.name, menuKeyboard)
    }).catch(error => {
      console.error(error.message)
    })
  }).catch(console.error)
}
