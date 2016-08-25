/*global beforeEach,afterEach,describe,it*/
import set from '../src/set'
import { reset, check, expect, expectCount } from './helpers/chaiCounter'

beforeEach(reset)
afterEach(check)

describe('set()', function () {
  it('should set a value in state', function () {
    expectCount(2)

    const action = set('state:test', 'XYZ')

    action({
      state: {
        set: function (path, value) {
          expect(path).to.equal('test')
          expect(value).to.equal('XYZ')
        }
      }
    })
  })

  it('should set a value with inline schemes', function () {
    expectCount(2)

    const action = set('state:test.{{state:foo}}', 'XYZ')

    action({
      state: {
        set: function (path, value) {
          expect(path).to.equal('test.foo')
          expect(value).to.equal('XYZ')
        },
        get: function (path) {
          return path
        }
      }
    })
  })

  it('should set a value on output', function () {
    expectCount(1)

    const action = set('output:test', 'XYZ')

    action({
      output: function (obj) {
        expect(obj.test).to.equal('XYZ')
      }
    })
  })
})
