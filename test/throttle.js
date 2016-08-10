/*global beforeEach,describe,it*/
import throttle from '../src/throttle'
import { expect } from 'chai'
import { Controller } from 'cerebral-testable'

function increaseCount ({ state }) {
  state.set('count', state.get('count') + 1)
}

describe('throttle()', function () {
  let controller, signals

  beforeEach(function () {
    [controller, signals] = Controller({
      count: 0
    })

    controller.addSignals({
      increaseImmediateThrottle: {
        chain: [
          throttle(1, [ increaseCount ])
        ], immediate: true}
    })
  })

  it('should not call increase more than twice', function (done) {
    signals.increaseImmediateThrottle()
    signals.increaseImmediateThrottle()
    signals.increaseImmediateThrottle()
    signals.increaseImmediateThrottle()
    signals.increaseImmediateThrottle()

    setTimeout(function () {
      expect(controller.get('count')).to.equal(2)
      done()
    }, 10)
  })
})
