/*global beforeEach,afterEach,describe,it*/
import unset from '../src/unset'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'

beforeEach(reset)
afterEach(check)

describe('unset()', function () {
  it('should unset a value', function () {
    expectCount(1)

    const action = unset('state:test')

    action({
      state: {
        unset (path) {
          expect(path).to.equal('test')
        }
      }
    })
  })

  it('should unset with inline schemes', function () {
    expectCount(1)

    const action = unset('state:test.{{input:path}}')

    action({
      input: {
        path: 'foo'
      },
      state: {
        unset (path) {
          expect(path).to.equal('test.foo')
        }
      }
    })
  })
})
