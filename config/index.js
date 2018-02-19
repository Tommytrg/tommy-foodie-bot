module.exports = {
  credentials: {
    slack: {
      verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
      botUserOauthAccessToken: process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN,
      clientId: process.env.SLACK_CLIENT_ID,
      clientScret: process.env.SLACK_CLIENT_SECRET
    }
  },
  bot: {
    mode: 'manual',
    startSchedule: '* * 10 * Friday', // http://merencia.com/node-cron/
    endSchedule: '* * 12 * Friday',
    phrases: {
      startAuto: 'TommyFoodie listen',
      start: 'TommyFoodie start',
      finish: 'TommyFoodie stop',
      greeting: 'Ey! Who is going to have lunch out today?'
    },
    groupSize: 7,
    storeName: 'store'
  },
  server: {
    port: 3000
  }
}
