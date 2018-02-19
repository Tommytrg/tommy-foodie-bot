require('dotenv').config()

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const normalizePort = require('normalize-port')
const slackEventsAPI = require('@slack/events-api')

const config = require('./config')
const oauth = require('./lib/routes/oauth')

const slackEvents = slackEventsAPI.createSlackEventAdapter(config.credentials.slack.verificationToken)
const slackEventsHandler = require('./lib/slack-events-handler')

slackEventsHandler(slackEvents)
// Create the server
const port = normalizePort(config.server.port || '3000')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use('/oauth', oauth)
app.use('/slack/events', slackEvents.expressMiddleware())
// Start the server
http.createServer(app).listen(port, () => {
  console.log(`server listening on port ${port}`)
})
