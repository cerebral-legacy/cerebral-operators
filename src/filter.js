import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function (path, filterFunc, acceptedChain = null) {
  const pathScheme = parseScheme(path)
  const discardedChain = []
  const filter = typeof filterFunc === 'function'
    ? filterFunc
    : (value) => value === filterFunc

  if (pathScheme.target !== 'state' && pathScheme.target !== 'input') {
    throw new Error('Cerebral operator FILTER - The path: "' + path + '" does not target "state" or "input"')
  }

  // define the action
  let action = function filterRead ({input, state, output}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))
    let value

    if (pathScheme.target === 'input') {
      value = input[pathValue]
    } else if (pathScheme.target === 'state') {
      value = state.get(pathValue)
    }

    output[filter(value) ? 'accepted' : 'discarded']()
  }

  action.outputs = ['accepted', 'discarded']
  action.displayName = 'operator FILTER'

  return acceptedChain ? [
    action, {
      accepted: acceptedChain,
      discarded: discardedChain
    }
  ] : action
}
