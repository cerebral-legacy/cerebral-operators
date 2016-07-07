/*global beforeEach,afterEach,describe,it*/
import filter from '../src/filter'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'
import controller from './helpers/controller'

controller.addSignals({
  filterTestTrue: {
    chain: [
      filter('input:value', (val) => val === 'filterTestTrue'), {
        accepted: [ () => { expect(true).to.be.ok } ],
        discarded: []
      }
    ],
    immediate: true
  },
  filterTestFalse: {
    chain: [
      filter('input:value', (val) => val === 'filterTestFalse'), {
        accepted: [],
        discarded: [ () => { expect(true).to.be.ok } ]
      }
    ],
    immediate: true
  },
  whenTestTrueArray: {
    chain: filter('input:value', (val) => val === 'whenTestTrueArray', [ () => { expect(true).to.be.ok } ]),
    immediate: true
  }
})

const signals = controller.getSignals()

beforeEach(reset)
afterEach(check)

describe('filter()', function () {
  it('should call accepted when func returns true', function () {
    expectCount(1)
    signals.filterTestTrue({ value: 'filterTestTrue' })
  })

  it('should call discarded when func return false', function () {
    expectCount(1)
    signals.filterTestFalse({ value: 'wrong value' })
  })

  it('should call implicatially call accepted when actions passed to factory', function () {
    expectCount(1)
    signals.filterTestFalse({ value: 'whenTestTrueArray' })
  })
})
