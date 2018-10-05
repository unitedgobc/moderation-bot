const Perspective = require('perspective-api-client')
const perspective = new Perspective({apiKey: process.env.PERSPECTIVE_API_KEY})

module.exports = bot => {
  bot.on('messageCreate', async msg => {
    if (msg.author.bot) return
    let res = await perspective.analyze(msg.cleanContent)
    // msg.channel.createMessage(`Comment toxicity rating: ${res.attributeScores.TOXICITY.summaryScore.value * 100}%`)
  })
}