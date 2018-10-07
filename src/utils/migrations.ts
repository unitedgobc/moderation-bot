import { ReqlClient } from 'rethinkdbdash/rethinkdbdash'

export default async function (r: ReqlClient) {
  let tableList = await r.tableList().run()

  // Table for storing morderation actions such as ban, kick, and mutes.
  if (!tableList.includes('cases')) await r.tableCreate('cases').run()
  let casesIndexList = await r.table('cases').indexList().run()
  if (!casesIndexList.includes('user')) r.table('cases').indexCreate('user').run()
  if (!casesIndexList.includes('moderator')) r.table('cases').indexCreate('moderator').run()

  // Table for storing warnings issued to users.
  if (!tableList.includes('warnings')) await r.tableCreate('warnings').run()
  let warningsIndexList = await r.table('warnings').indexList().run()
  if (!warningsIndexList.includes('user')) r.table('warnings').indexCreate('user').run()
  if (!warningsIndexList.includes('moderator')) r.table('warnings').indexCreate('moderator').run()

  // Table for storing servers to sync bans and kicks across.
  if (!tableList.includes('servers')) await r.tableCreate('servers').run()

  // Table for storing notes on users.
  if (!tableList.includes('notes')) await r.tableCreate('notes').run()
  let notesIndexList = await r.table('notes').indexList().run()
  if (!notesIndexList.includes('user')) r.table('notes').indexCreate('user').run()
  if (!notesIndexList.includes('author')) r.table('notes').indexCreate('author').run()
}
