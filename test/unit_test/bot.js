/* eslint-disable no-unused-expressions */
const expect = require('chai').expect
const sinon = require('sinon')

const config = require('../../config')
const bot = require('../../lib/bot')

describe(' --- Bot methods---', function () {
  describe('#handleMessageInput', function () {
    describe('--Case startPhrase --', function () {
      it('should call updateCounting with true', function () {
        const startPrhase = config.bot.phrases.start
        const event = {
          text: startPrhase
        }
        const state = {
          updateCounting: function () {}
        }
        const spy = sinon.spy(state, 'updateCounting')
        bot.handleMessageInput(event, state)
        expect(spy.withArgs(true).calledOnce).to.be.true
      })

      it('should NOT call updateCounting with true', function () {
        const event = {
          subtype: 'bot_message'
        }
        const state = {
          updateCounting: function () {}
        }
        const spy = sinon.spy(state, 'updateCounting')
        bot.handleMessageInput(event, state)
        expect(spy.notCalled).to.be.true
        event.subtype = 'channel_join'
        bot.handleMessageInput(event, state)
        expect(spy.notCalled).to.be.true
      })
    })
    describe('--Case default --', function () {
      it('should NOT call addParticipant with state NOT counting', function () {
        const event = {
          user: 'Fluffy',
          text: 'join'
        }
        const state = {
          updateCounting: function () {},
          counting: false,
          addParticipant: function () {},
          isParticipant: function () {}
        }
        const updateCounting = sinon.stub(state, 'updateCounting')
        const isParticipant = sinon.stub(state, 'isParticipant')
        const addParticipant = sinon.spy(state, 'addParticipant')

        bot.handleMessageInput(event, state)

        expect(updateCounting.notCalled).to.be.true
        expect(addParticipant.notCalled).to.be.true
        expect(isParticipant.notCalled).to.be.true
      })
      it('should call addParticipant with user NOT participating', function () {
        const event = {
          user: 'Fluffy',
          text: 'join'
        }
        const state = {
          updateCounting: function () {},
          counting: true,
          addParticipant: function () {},
          isParticipant: function () {}
        }
        const updateCounting = sinon.stub(state, 'updateCounting')
        const isParticipant = sinon.stub(state, 'isParticipant')
        const addParticipant = sinon.spy(state, 'addParticipant')
        isParticipant.returns(false)

        bot.handleMessageInput(event, state)

        expect(updateCounting.notCalled).to.be.true
        expect(isParticipant.withArgs(event.user).calledOnce).to.be.true
        expect(addParticipant.withArgs(event.user).calledOnce)
      })
      it('should NOT call addParticipant with user participating', function () {
        const event = {
          user: 'Fluffy',
          text: 'join'
        }
        const state = {
          counting: true,
          updateCounting: function () {},
          addParticipant: function () {},
          isParticipant: function () {}
        }
        const updateCounting = sinon.stub(state, 'updateCounting')
        const isParticipant = sinon.stub(state, 'isParticipant')
        const addParticipant = sinon.spy(state, 'addParticipant')
        isParticipant.returns(true)

        bot.handleMessageInput(event, state)

        expect(updateCounting.notCalled).to.be.true
        expect(isParticipant.withArgs(event.user).calledOnce).to.be.true
        expect(addParticipant.withArgs(event.user).calledOnce)
      })
    })
    describe('--Case finish --', function () {
      it('should finish counting', function () {
        const finishPhrase = config.bot.phrases.finish
        const event = {
          text: finishPhrase
        }
        const state = {
          participants: ['Bubba', 'Ginger'],
          counting: true,
          updateCounting: function () {},
          getPastGroups: function () {
            return []
          },
          addMeal: function () {}

        }
        const result = [{
          leader: 'Bubba',
          participants: ['Bubba', 'Ginger']
        }]
        const updateCountingSpy = sinon.spy(state, 'updateCounting')
        const addMealSpy = sinon.spy(state, 'addMeal')

        bot.handleMessageInput(event, state)
        expect(updateCountingSpy.withArgs(false).calledOnce).to.be.true
        expect(addMealSpy.withArgs(result).calledOnce).to.be.true
        expect(addMealSpy.args[0].leader).to.be.equal(result.leader)
        expect(addMealSpy.args[0].participants).to.be.deep.equal(result.participants)
      })
      it('should finish counting and make group', function () {
        const finishPhrase = config.bot.phrases.finish
        const event = {
          text: finishPhrase
        }
        const state = {
          participants: ['Bubba', 'Ginger'],
          counting: true,
          updateCounting: function () {},
          getPastGroups: function () {
            return []
          },
          addMeal: function () {}

        }
        const result = [{
          leader: 'Bubba',
          participants: ['Bubba', 'Ginger']
        }]
        const updateCountingSpy = sinon.spy(state, 'updateCounting')
        const addMealSpy = sinon.spy(state, 'addMeal')

        bot.handleMessageInput(event, state)
        expect(updateCountingSpy.withArgs(false).calledOnce).to.be.true
        expect(addMealSpy.calledOnce).to.be.true
        expect(addMealSpy.args[0][0][0].leader).to.be.equal(result[0].leader)
        expect(addMealSpy.args[0][0][0].participants).to.be.deep.equal(result[0].participants)
      })
      it('should finish counting and make group', function () {
        const finishPhrase = config.bot.phrases.finish
        const event = {
          text: finishPhrase
        }
        const state = {
          participants: [
            'Bubba', 'Ginger', 'Rocky', 'Max',
            'Tinkerbell', 'Oliver', 'Mittens', 'Nala'
          ],
          counting: true,
          updateCounting: function () {},
          getPastGroups: function () {
            return []
          },
          addMeal: function () {}
        }
        const result = [{
          leader: 'Bubba',
          participants: [
            'Bubba', 'Rocky', 'Tinkerbell', 'Mittens'
          ]
        },
        {
          leader: 'Ginger',
          participants: [
            'Ginger', 'Max', 'Oliver', 'Nala'
          ]
        }]
        const updateCountingSpy = sinon.spy(state, 'updateCounting')
        const addMealSpy = sinon.spy(state, 'addMeal')

        bot.handleMessageInput(event, state)
        expect(updateCountingSpy.withArgs(false).calledOnce).to.be.true
        expect(addMealSpy.calledOnce).to.be.true
        expect(addMealSpy.args[0][0][0].leader).to.be.equal(result[0].leader)
        expect(addMealSpy.args[0][0][0].participants).to.be.deep.equal(result[0].participants)
      })
      it('should finish counting and make not repeated group', function () {
        const finishPhrase = config.bot.phrases.finish
        const event = {
          text: finishPhrase
        }
        const state = {
          participants: [
            'Bubba', 'Ginger', 'Rocky', 'Max',
            'Tinkerbell', 'Oliver', 'Mittens', 'Nala'
          ],
          counting: true,
          updateCounting: function () {},
          getPastGroups: function () {
            return []
          },
          addMeal: function () {}
        }
        const pastGroups = [{
          leader: 'Bubba',
          participants: [
            'Bubba', 'Rocky', 'Tinkerbell', 'Mittens', 'Alfred'
          ]
        },
        {
          leader: 'Ginger',
          participants: [
            'Ginger', 'Max', 'Oliver', 'Nala', 'Oreo'
          ]
        }
        ]
        const updateCountingSpy = sinon.spy(state, 'updateCounting')
        const addMealSpy = sinon.spy(state, 'addMeal')
        const getPastGroupsStub = sinon.stub(state, 'getPastGroups').returns(pastGroups)
        bot.handleMessageInput(event, state)
        expect(updateCountingSpy.withArgs(false).calledOnce).to.be.true
        expect(addMealSpy.calledOnce).to.be.true
        expect(getPastGroupsStub.calledOnce).to.be.true
        expect(addMealSpy.args[0][0][0].leader).to.not.be.equal(pastGroups[0].leader)
        expect(addMealSpy.args[0][0][1].leader).to.not.be.equal(pastGroups[1].leader)
        expect(addMealSpy.args[0][0][0].participants).to.not.be.deep.equal(pastGroups[0].participants)
        expect(addMealSpy.args[0][0][1].participants).to.not.be.deep.equal(pastGroups[1].participants)
      })
    })
  })
})
