import getCompiler from 'cerebral-url-scheme-compiler/get'
import toDisplayName from './helpers/toDisplayName'

export default function (path, filterFunc, acceptedChain = null, options = null) {
  const getValue = getCompiler(path)

  const {
    discardedChain = []
  } = (options || {})

  const filter = typeof filterFunc === 'function'
    ? filterFunc
    : (value) => value === filterFunc

  // test the getter returned value
  const filterTest = (args, value) => {
    args.output[filter(value, args) ? 'accepted' : 'discarded']()
  }

  // define the action
  let action = function filterRead (args) {
    let value = getValue(args)
    if (value && typeof value.then === 'function') {
      value.then((val) => filterTest(args, val)).catch((error) => {
        console.error(`${action.displayName} caught an error whilst getting a value to test`, error)
      })
    } else {
      filterTest(args, value)
    }
  }

  action.displayName = `operators.filter(${toDisplayName(path, getValue)})`

  return !acceptedChain ? action : [
    action, {
      accepted: acceptedChain,
      discarded: discardedChain
    }
  ]
}
