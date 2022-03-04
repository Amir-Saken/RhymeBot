global.fetch = require('node-fetch');

const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

const databaseForUsers = require('./DatabaseForUsers')

const random = require('random');

const { Telegraf } = require('telegraf');
const TelegramApi = require('node-telegram-bot-api');

const bot1 = new TelegramApi('1961258817:AAGEDb9noYHhrAShvlix736mDY9aPankGCo');
const bot = new Telegraf('1961258817:AAGEDb9noYHhrAShvlix736mDY9aPankGCo');


let keyboard = Markup.inlineKeyboard([
    Markup.urlButton('👍', 'http://telegraf.js.org'),
    Markup.callbackButton('Delete', 'delete')
])

bot1.setMyCommands([
    {command: '/start', description: 'Start'},
    {command: '/info', description: 'Information about the bot'},
    {command: '/created', description: 'Create a new user'}
])

bot.command('created', async (ctx) => {
    await databaseForUsers.findOne({chatId:ctx.chat.id}, function(err, user) {
       if(!user){
           let databaseFill =  new databaseForUsers({
               chatId:  ctx.chat.id,
               name: ctx.from.first_name,
               permission: true,
           });
           databaseFill.save(function(err) {
               if(err) {
                   console.log('Error');
               }
           })
       } else{
           ctx.reply(`Hello, ${ctx.from.first_name}!  \nYou have created a user`)
           console.log(user);
       }
    });
})

bot.start( ctx => ctx.reply(`Hello, ${ctx.from.first_name}! 🖐🏻 \nSend me a message 😉`))

bot.command('info', (ctx) => ctx.reply(`Hello, ${ctx.from.first_name}! \nI am a Rhyme Bot Amir`))

bot.action('delete', ({ deleteMessage }) => deleteMessage())

bot.on('text', async (ctx) => {
    let allow = await databaseForUsers.find({$and: [{chatId: ctx.chat.id}, {permission: true}]})
        if(allow.length > 0) {
            const userText = ctx.message.text;
            fetch('https://rhymebrain.com/talk?function=getRhymes&word=' + userText)
                .then(function (data) {
                    data.json().then(data2 => {
                        ctx.reply(data2[random.int(0, data2.length - 1)].word, Extra.markup(keyboard));
                    })
                }).catch(function (err) {
                console.log('Fetch error' + err);
            })
        } else {
            ctx.reply("You are banned");
        }
})

bot.launch()