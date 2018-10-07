import { Message } from 'eris'

const Perspective = require('perspective-api-client')
const perspective = new Perspective({ apiKey: process.env.PERSPECTIVE_API_KEY })

module.exports = bot => {
  bot.on('messageCreate', async (msg: Message) => {
    if (msg.author.bot) return
    let res = await perspective.analyze(msg.cleanContent)
    if (res.attributeScores.TOXICITY.summaryScore.value > 0.7) {
      msg.addReaction('⚠')
    }
  })
}
