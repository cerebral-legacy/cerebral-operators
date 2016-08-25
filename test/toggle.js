/*global beforeEach,afterEach,describe,it*/
import toggle from '../src/toggle'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'

beforeEach(reset)
afterEach(check)

describe('toggle()', function () {
  it('should toggle true and false', function () {
    expectCount(3)

    const action = toggle('state:test')

    action({
      state: {
        get (path) {
          expect(path).to.equal('test')
          return false
        },
        set (path, value) {
          expect(path).to.equal('test')
          expect(value).to.equal(true)
        }
      }
    })
  })

  it('should toggle with inline schemes', function () {
    expectCount(3)

    const action = toggle('state:{{input:path}}')

    action({
      input: {
        path: 'test'
      },
      state: {
        get (path) {
          expect(path).to.equal('test')
          return false
        },
        set (path, value) {
          expect(path).to.equal('test')
          expect(value).to.equal(true)
        }
      }
    })
  })

  it('should toggle custom values', function () {
    expectCount(3)

    const action = toggle('state:test', 'ON', 'OFF')

    action({
      state: {
        get (path) {
          expect(path).to.equal('test')
          return 'ON'
        },
        set (path, value) {
          expect(path).to.equal('test')
          expect(value).to.equal('OFF')
        }
      }
    })
  })
})
