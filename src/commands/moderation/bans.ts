import ModerationClient from '../../structures/ModerationClient'
import { ReqlClient } from 'rethinkdbdash/rethinkdbdash'
import { Message, TextChannel, Member, User } from 'eris'
import * as shortid from 'shortid'
import { ModerationCase } from '../../utils/types'

module.exports = (bot: ModerationClient, r: ReqlClient) => {
  bot.registerCommand('ban', (msg: Message, args: Array<string>) => {
    let bannedMember = bot.resolveMember(args[0], (msg.channel as TextChannel).guild)
    if ((bannedMember instanceof Member)) {
      if (msg.author.id === (bannedMember as Member).id || bot.memberModifiable(bannedMember as Member, msg.member)) return msg.channel.createMessage('Insufficient Permissions.')
    }

    let action: ModerationCase = {
      action: 'ban',
      moderator: msg.author.id,
      reason: args.slice(1).join(' '),
      timestamp: r.now(),
      user: (bannedMember as Member).id || bannedMember as string
    }

    let userName: string
    if ((bannedMember instanceof User) || (bannedMember instanceof Member)) {
      userName = ((bannedMember as User).username + `#` + (bannedMember as User).discriminator)
    } else {
      userName = `<@${bannedMember as string}> (${bannedMember as string})`
    }
    msg.channel.createMessage(`Banning ${userName}`)

  }, {
    guildOnly: true,
    requirements: {
      permissions: {
        banMembers: true
      }
    }
  })
}
