//api
const TelegramApi = require('node-telegram-bot-api')
//bd
const sequelize = require('./db')
const people = require('./models').people
const { Op } = require('sequelize')
function getChatId(msg) {
    return msg.chat.id
 } 

const token = '6204465674:AAEz8RMRZG6F9zpr2Nv5tGEcz0AKw_7GXR0'

const bot = new TelegramApi(token, {polling: true})

bot.on('message', msg=>{
    console.log(msg)
})

bot.onText(/\/start/, msg => {
    
    const reqPhone = {
        reply_markup: {
            
            keyboard: [
                [{
                text: "Отправить мой номер",
                request_contact: true,
                remove_keyboard: true,
                
                }],
                ["Отмена"]
            ]
        }
    }  
    
    try{
        sequelize.authenticate( 
        sequelize.sync(),
        console.log('db  in')
        )

    } catch (e) { console.log('db  errors')}

    function check_id(){
        
        const isIdUnique = chat_id =>
            people.findOne({ where: { chat_id} , attributes: ['chat_id'] })
            .then(token => token !== null)
            .then(isUnique => isUnique);

        // const isIdUniqueAccess = access_level =>
        //     personalModel.findOne({ where: { [Op.and]: [{access_level},{chat_id:msg.chat.id}] } , attributes: ['chat_id'] })  
        //     .then(isIdUniqueAccess => isIdUniqueAccess);
        bot.sendMessage(getChatId(msg), 'ищу вас..')
        isIdUnique(msg.chat.id).then(isUnique => {
            if (isUnique) {
                people.findOne({where:{chat_id:getChatId(msg)}, attributes: ['name']})
                                .then(user=>{
                                    bot.sendMessage(getChatId(msg), 'Вы можете начать работа23ть с ботом' + user.name)
                                }).catch(err=>console.log(err));

                // isIdUniqueAccess(1).then(isIdUniqueAccess => {
                //     if (isIdUniqueAccess) {
                //         bot.sendMessage(getChatId(msg), '1')
                //     }
                //     else{
                //         bot.sendMessage(getChatId(msg), '!=1')
                        
                //     }
                // })
            }
            else{
                bot.sendMessage(getChatId(msg), 'Вас нет в списке, отправьте номер ', reqPhone)
                
                bot.once('contact', msg=>{
                    const telUser = msg.contact.phone_number.replace('+','')
                    
                    function check_num(){
    
                        const isIdUnique = nomber =>
                            people.findOne({ where: { nomber} , attributes: ['nomber'] })
                            .then(token => token !== null)
                            .then(isUnique => isUnique);
                    
                        isIdUnique(telUser).then(isUnique => {
                            if (isUnique) {
                                people.findOne({where:{nomber:telUser}, attributes: ['name']})
                                .then(user=>{
                                    bot.sendMessage(getChatId(msg), 'Вы можете начать работать с ботом' + user.name)
                                }).catch(err=>console.log(err));
                                
                                sequelize.query("UPDATE people SET chat_id = $2 WHERE nomber = $1", {
                                    bind:[telUser,msg.chat.id],
                                    model: people,   
                                    mapToModel: true,
                                    type: Op.SELECT,
                                })
                                
                            }
                            else{
                                bot.sendMessage(getChatId(msg), 'Вас нет в списке, обратьтесь к администратору')
                            }
                        })
                    }
                    check_num()                   
                })
            }
        })
    }
    check_id()
})

