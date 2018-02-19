const express = require('express')
const request = require('request')
const router = express.Router()

const config = require('../../config')

router.get('/', function (req, res) {
  if (!req.query.code) {
    res.status(500)
    res.json({
      'Error': "Looks like we're not getting code."
    })
    console.log("Looks like we're not getting code.")
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: {
        code: req.query.code,
        client_id: config.credentials.slack.clientId,
        client_secret: config.credentials.slack.clientScret
      },
      method: 'GET'
    }, function (error, response, body) {
      if (error) {
        console.log(error)
      } else {
        res.json(body)
      }
    })
  }
})

module.exports = router
