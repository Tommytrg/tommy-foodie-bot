const R = require('ramda')
const store = require('../store')
module.exports = {
  createState: () => {
    return {
      counting: false,
      participants: [],
      addMeal: function (meal) {
        store.postMeal(meal)
      },
      addParticipant: function (participant) {
        this.participants.push(participant)
      },
      getPastGroups: function () {
        return store.getGroups()
      },
      isParticipant: function (user) {
        return R.contains(user, this.participants)
      },
      updateCounting: function (value) {
        this.counting = !!value
      }
    }
  }
}
