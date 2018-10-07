import ModerationClient from './structures/ModerationClient'
import * as rethinkdbdash from 'rethinkdbdash'
import 'source-map-support/register'
import * as path from 'path'

const r = rethinkdbdash({
  optionalRun: false,
  servers: [{
    host: 'rethink',
    port: 28015
  }]
})

let bot = new ModerationClient(process.env.TOKEN)

bot.loadDirectory(path.join(__dirname, './commands'), r)
bot.loadDirectory(path.join(__dirname, './events'), r)

bot.on('ready', () => console.log('Connected'))

bot.connect()
