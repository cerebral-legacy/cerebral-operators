/*global beforeEach,afterEach,describe,it*/
import delay from '../src/delay'
import { reset, check, expect } from './helpers/chaiCounter'
import controller from './helpers/controller'

function increaseCount ({ state }) {
  state.set('count', state.get('count') + 1)
}

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

const signals = controller.getSignals()
let tree

beforeEach(reset)
afterEach(check)

describe('delay()', function () {
  beforeEach(function () {
    tree = controller.model.tree
    tree.set({
      count: 0
    })
    tree.commit()
  })

  it('should not call increase before delay is done', function (done) {
    signals.increase()
    expect(tree.get('count')).to.equal(0)

    setTimeout(function () {
      expect(tree.get('count')).to.equal(1)
      done()
    }, 10)
  })
  it('should not call increase before delay is done, using factory', function (done) {
    signals.withFactory()
    expect(tree.get('count')).to.equal(0)

    setTimeout(function () {
      expect(tree.get('count')).to.equal(1)
      done()
    }, 10)
  })
})
