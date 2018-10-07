import ModerationClient from './structures/ModerationClient'
import * as rethinkdbdash from 'rethinkdbdash'
import 'source-map-support/register'
import * as path from 'path'
import { ClientOptions, CommandClientOptions } from 'eris'

const r = rethinkdbdash({
  optionalRun: false,
  servers: [{
    host: 'rethink',
    port: 28015
  }]
})

let options: ClientOptions = {
  defaultImageFormat: 'png',
  autoreconnect: false
}

let commandOptions: CommandClientOptions = {
  prefix: process.env.PREFIX.split(','),
  ignoreBots: true,
  owner: process.env.OWNER_NAME,
  defaultCommandOptions: {
    caseInsensitive: true,
    permissionMessage: 'You do not have permission to run this command. If you think this is in error please let a moderator or administrator know.',
    errorMessage: `An unknown error has occured. Please let ${process.env.OWNER_NAME} know.`
  },
  description: 'A bot to enable consistent cross-server moderation.'
}

let bot = new ModerationClient(process.env.TOKEN, options, commandOptions)

bot.loadDirectory(path.join(__dirname, './commands'), r)
bot.loadDirectory(path.join(__dirname, './events'), r)

bot.on('ready', () => console.log('Connected'))

bot.connect()
