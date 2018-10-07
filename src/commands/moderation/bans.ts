import ModerationClient from '../../structures/ModerationClient'
import { ReqlClient } from 'rethinkdbdash/rethinkdbdash'
import { Message } from 'eris'

module.exports = (bot: ModerationClient, r: ReqlClient) => {
  bot.registerCommand('ban', (msg: Message, args: Array<string>) => {
    console.log('banne')
  })
}
