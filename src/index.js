const { CommandClient } = require('eris')
const r = require('rethinkdbdash')({
  optionalRun: false,
  servers: [{
    host: 'rethink',
    port: 28015
  }]
})

let bot = new CommandClient(process.env.TOKEN)

require('./events/message')(bot)

bot.on('ready', () => console.log('Connected'))

bot.connect()
