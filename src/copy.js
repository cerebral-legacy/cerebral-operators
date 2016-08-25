import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'

export default function (fromPath, toPath) {
  const fromPathScheme = parseScheme(fromPath)
  const toPathScheme = parseScheme(toPath)

  if (fromPathScheme.target !== 'input' && fromPathScheme.target !== 'state') {
    throw new Error('Cerebral operator COPY - The path: "' + fromPath + '" is not valid, you have to give it a "state" or "input" target')
  }

  if (toPathScheme.target !== 'state' && toPathScheme.target !== 'output') {
    throw new Error('Cerebral operator COPY - The path: "' + toPath + '" is not valid, you have to give it a "state" or "output" target')
  }

  const copy = function ({input, state, output}) {
    const fromPathValue = fromPathScheme.getValue(populateInputAndStateSchemes(input, state))
    const toPathValue = toPathScheme.getValue(populateInputAndStateSchemes(input, state))
    let fromValue

    if (fromPathScheme.target === 'input') {
      fromValue = input[fromPathValue]
    } else if (fromPathScheme.target === 'state') {
      fromValue = state.get(fromPathValue)
    }

    if (toPathScheme.target === 'state') {
      state.set(toPathValue, fromValue)
    } else if (toPathScheme.target === 'output') {
      output({[toPathScheme.value]: fromValue})
    }
  }

  copy.displayName = 'operator COPY'
  return copy
}
