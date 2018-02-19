const { WebClient } = require('@slack/client')
const R = require('ramda')

const compose = R.compose
const concat = R.concat
const contains = R.contains
const each = R.forEach
const filter = R.filter
const flatten = R.flatten
const map = R.map
const not = R.not
const reduce = R.reduce
const reduceIndexed = R.addIndex(reduce)

const config = require('../config')

module.exports = {
  web: new WebClient(config.credentials.slack.botUserOauthAccessToken),
  handleMessageInput (event, state) {
    const startPhrase = config.bot.phrases.start
    const finishPhrase = config.bot.phrases.finish
    if (isInvalidMessage(event)) {
      return
    }
    switch (event.text.toLowerCase()) {
      case startPhrase.toLowerCase():
        state.updateCounting(true)
        const text = config.bot.phrases.greeting
        return this.postMessage(event.channel, text)
      case finishPhrase.toLocaleLowerCase():
        if (state.counting) {
          state.updateCounting(false)
          const participants = state.participants
          const pGroups = state.getPastGroups()
          const pParticipants = map(
            group => group.participants, pGroups
          )
          const numGroups = Math.ceil(participants.length / config.bot.groupSize)
          const areRepeaters = (pParticipants) =>
            filter(
              pParticipant =>
                contains(pParticipant, participants),
              flatten
            )

          const areNewcomers = filter(
            participant =>
              participants =>
                compose(
                  not,
                  contains(participant),
                  flatten(pParticipants)
                )
          )

          const sortedParticipants = concat(
            areRepeaters(pParticipants),
            areNewcomers(participants)
          )

          const groups = reduceIndexed((acc, participant, index) => {
            const num = (index + numGroups) % numGroups
            if (!acc[num]) {
              acc.push([])
            }
            acc[num].push(participant)
            return acc
          }, [], sortedParticipants)

          const meal = reduce((acc, group) => {
            return acc.concat({
              participants: group,
              leader: getLeader(group, pGroups)
            })
          }, [], groups)
          const message = reduceIndexed((acc, group, index) => {
            return `${acc}\n-- Group ${index + 1} --\nLeader: ${group.leader}\nParticipants: ${reduce((acc, x) => `${acc}\n${x}`, '', group.participants)}`
          }, '', meal)
          this.postMessage(event.channel, message)
          state.addMeal(meal)
        }
        break
      default:
        if (state.counting) {
          if (!state.isParticipant(event.user)) {
            state.addParticipant(event.user)
          }
        }
    }
  },
  postMessage (channel, string) {
    return this.web.chat.postMessage(channel, string)
      .then((res) => {
        console.log('Message sent: ', res.ts)
      })
      .catch((console.error))
  }
}

function countTimesLeadering (candidate, pGroups) {
  return reduce((acc, group) => {
    const wasLeader = group.leader === candidate
    if (wasLeader) acc += 1
    return acc
  }, 0, pGroups)
}

function getLeader (groupParticipants, pGroups) {
  let bestTimes = 0
  let bestCandidate
  if (!pGroups.length) {
    return groupParticipants[0]
  }
  each(candidate => {
    let timesLeadering = countTimesLeadering(candidate, pGroups)
    if (candidate && timesLeadering <= bestTimes) {
      bestTimes = timesLeadering
      bestCandidate = candidate
    }
  }, groupParticipants)
  return bestCandidate
}

function isInvalidMessage (event) {
  return event.subtype === 'bot_message' || event.subtype === 'channel_join'
}
