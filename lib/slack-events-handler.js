const config = require('../config')
const bot = require('./bot')
const State = require('./models/state')
const cron = require('node-cron')

module.exports = function (slackEvents) {
  const state = State.createState()
  if (config.bot.mode === 'manual') {
    slackEvents.on('message', (event) => {
      bot.handleMessageInput(event, state)
    })
  } else if (config.bot.mode === 'automatic') {
    const startEvent = {
      channel: '',
      text: config.bot.phrases.start,
      type: 'message',
      user: 'TommyFoodie'
    }
    const endEvent = {
      channel: '',
      text: config.bot.phrases.finish,
      type: 'message',
      user: 'TommyFoodie'
    }

    const startTask = cron.schedule(config.bot.startSchedule, function () {
      bot.handleMessageInput(startEvent, state)
    })
    const endTask = cron.schedule(config.bot.endSchedule, function () {
      bot.handleMessageInput(endEvent, state)
    })

    slackEvents.on('message', (event) => {
      if (event.text === config.bot.phrases.startAuto) {
        const channel = event.channel
        startEvent.channel = channel
        endEvent.channel = channel
        startTask.start()
        endTask.start()
      }
    })

    slackEvents.on('message', (event) => {
      const isStartPhrase = event.text !== config.bot.phrases.start
      const isFinishPhrase = event.text !== config.bot.phrases.finish
      if (!isStartPhrase && !isFinishPhrase) {
        bot.handleMessageInput(event, state)
      }
    })
  }
}
