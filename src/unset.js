import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function (path) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'state') {
    throw new Error('Cerebral operator UNSET - The path: "' + path + '" does not target "state"')
  }

  const unset = function unset ({input, state}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))

    state.unset(pathValue)
  }

  unset.displayName = 'operator UNSET'

  return unset
}
