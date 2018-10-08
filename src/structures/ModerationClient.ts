import { CommandClient, Guild, Member, User } from 'eris'
import * as path from 'path'
import * as fs from 'fs'
import { ReqlClient } from 'rethinkdbdash/rethinkdbdash'

export default class ModerationClient extends CommandClient {
  loadDirectory (dir: string, r: ReqlClient): void {
    if (!fs.lstatSync(dir).isDirectory()) console.error(`[Loader]: ${dir} is not a directory.`)
    fs.readdirSync(dir).forEach(file => {
      if (!fs.lstatSync(path.join(dir, file)).isDirectory() && file.endsWith('.js')) {
        try {
          require(path.join(dir, file))(this, r)
          console.log(`Loaded commands from ${dir}/${file}`)
        } catch (err) {
          console.error(`Unable to load ${dir}/${file}. Error: ${err}`)
        }
      } else if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
        this.loadDirectory(path.join(dir, file), r)
      }
    })
  }

  resolveMember (mention: string, guild: Guild): Member | User | string | null {
    const matches = mention.match(/^(?:<@!?)?([0-9]+)>?$/)
    if (matches) return guild.members.get(matches[1]) || this.users.get(matches[1]) || matches[1]
    const search = mention.toLowerCase()

    const members = guild.members.filter(memberFilterInexact(search))
    if (members.length === 0) return null
    if (members.length === 1) return members[0]
    const exactMembers = members.filter(memberFilterExact(search))
    if (exactMembers.length === 1) return exactMembers[0]

    const users = this.users.filter(memberFilterInexact(search))
    if (users.length === 0) return null
    if (users.length === 1) return users[0]
    const exactUsers = this.users.filter(memberFilterExact(search))
    if (exactUsers.length === 1) return exactUsers[0]

    return null

    function memberFilterExact (search) {
      return mem => mem.user.username.toLowerCase() === search ||
        (mem.nickname && mem.nickname.toLowerCase() === search) ||
        `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search
    }

    function memberFilterInexact (search) {
      return mem => mem.user.username.toLowerCase().includes(search) ||
        (mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
        `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search)
    }
  }

  memberModifiable (member: Member, editor: Member): boolean {
    let memberRoles = []
    member.roles.forEach(role => {
      let guildRole = member.guild.roles.get(role)
      memberRoles.push(guildRole)
    })
    memberRoles.sort((x, y) => {
      return y.position - x.position
    })

    let editorRoles = []
    editor.roles.forEach(role => {
      let guildRole = editor.guild.roles.get(role)
      editorRoles.push(guildRole)
    })
    editorRoles.sort((x, y) => {
      return y.position - x.position
    })

    if (member.guild.ownerID === member.id) return false
    if (editorRoles[0].position >= memberRoles[0].position) return false
    else return true
  }
}
