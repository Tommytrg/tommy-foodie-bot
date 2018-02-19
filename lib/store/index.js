const fs = require('fs')
const R = require('ramda')

module.exports = {
  getGroups,
  postMeal
}

function getGroups () {
  const data = fs.readFileSync('./lib/store/store.json', 'utf8')
  return R.reduce((acc, meal) => {
    return acc.concat(meal)
  }, [], JSON.parse(data).meals)
}

function postMeal (meal) {
  fs.writeFileSync('./lib/store/store.json', JSON.stringify({meals: meal}), { encoding: 'utf8' })
}
