import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function (path, value) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'state' && pathScheme.target !== 'output') {
    throw new Error('Cerebral operator SET - The path: "' + path + '" does not target "state" or "output"')
  }

  const set = function set ({input, state, output}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))

    if (pathScheme.target === 'state') {
      state.set(pathValue, value)
    } else {
      output({[pathValue]: value})
    }
  }

  set.displayName = 'operator SET'

  return set
}
