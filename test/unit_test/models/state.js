/* eslint-disable no-unused-expressions */
const expect = require('chai').expect

const State = require('../../../lib/models/state')

describe('--- State Model ---', function () {
  let state
  beforeEach(function () {
    state = State.createState()
  })
  describe('#createState method', function () {
    it('should return a state object', function () {
      // attributes
      expect(state).to.have.property('counting', false)
      expect(state).to.have.property('participants')
      expect(state.participants).to.deep.equal([])
      // methods
      expect(state).to.have.property('addMeal')
      expect(state).to.have.property('addParticipant')
      expect(state).to.have.property('getPastGroups')
      expect(state).to.have.property('isParticipant')
      expect(state).to.have.property('updateCounting')
    })
  })
  describe('State methods', function () {
    describe('#addParticipant', function () {
      it('should add a participant', function () {
        expect(state.participants).to.deep.equal([])
        state.addParticipant('Jack')
        expect(state.participants).to.deep.equal(['Jack'])
        state.addParticipant('Bandit')
        expect(state.participants).to.deep.equal(['Jack', 'Bandit'])
        state.addParticipant('Chester')
        expect(state.participants).to.deep.equal(['Jack', 'Bandit', 'Chester'])
        state.addParticipant('Gizmo')
        expect(state.participants).to.deep.equal(['Jack', 'Bandit', 'Chester', 'Gizmo'])
        state.addParticipant('Snickers')
        expect(state.participants).to.deep.equal(['Jack', 'Bandit', 'Chester', 'Gizmo', 'Snickers'])
      })
    })
    describe('#isParticipant', function () {
      it('should check if a user participating and there is not any participant', function () {
        state.participants = []
        expect(state.isParticipant('Tigger')).to.be.false
        expect(state.isParticipant('Rusty')).to.be.false
      })
      it('should check if a user participating and there are some participants ', function () {
        state.participants = ['Tigger', 'Princess', 'Lucky']
        expect(state.isParticipant('Tigger')).to.be.true
        expect(state.isParticipant('Rusty')).to.be.false
      })
    })
    describe('#updateCounting', function () {
      it('should change counting property', function () {
        expect(state.counting).to.be.false
        state.updateCounting(true)
        expect(state.counting).to.be.true
        state.updateCounting(false)
        expect(state.counting).to.be.false
        state.updateCounting(true)
        expect(state.counting).to.be.true
        state.updateCounting(false)
        expect(state.counting).to.be.false
      })
    })
  })
})
