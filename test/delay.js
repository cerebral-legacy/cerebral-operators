/*global beforeEach,afterEach,describe,it*/
import delay from '../src/delay'
import { reset, check, expect } from './helpers/chaiCounter'
import { Controller } from 'cerebral-testable'

function increaseCount ({ state }) {
  state.set('count', state.get('count') + 1)
}

beforeEach(reset)
afterEach(check)

describe('delay()', function () {
  let controller, signals

  beforeEach(function () {
    [controller, signals] = Controller({
      count: 0
    })

    controller.addSignals({
      increase: {
        chain: [delay(5), {continue: [increaseCount]}],
        immediate: true
      },
      withFactory: {
        chain: delay(5, [increaseCount]),
        immediate: true
      }
    })
  })

  it('should not call increase before delay is done', function (done) {
    signals.increase()
    expect(controller.get('count')).to.equal(0)

    setTimeout(function () {
      expect(controller.get('count')).to.equal(1)
      done()
    }, 10)
  })
  it('should not call increase before delay is done, using factory', function (done) {
    signals.withFactory()
    expect(controller.get('count')).to.equal(0)

    setTimeout(function () {
      expect(controller.get('count')).to.equal(1)
      done()
    }, 10)
  })
})
