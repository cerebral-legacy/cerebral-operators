import Symbol from 'es6-symbol'
import parseScheme from 'cerebral-scheme-parser'
import populateInputAndStateSchemes from './helpers/populateInputAndStateSchemes'
const truthy = Symbol('truthy')
const falsy = Symbol('falsy')
const otherwise = Symbol('otherwise')

function when (path, conditions = { 'true': truthy, 'false': otherwise }) {
  const pathScheme = parseScheme(path)

  if (pathScheme.target !== 'state' && pathScheme.target !== 'input') {
    throw new Error('Cerebral operator WHEN - The path: "' + path + '" does not target "input" or "state"')
  }

  // prepare the output conditions
  let otherwisePath = null
  const outputConditions = {}

  for (let path in conditions) {
    outputConditions[path] = conditions[path]
    otherwisePath = otherwisePath || (conditions[path] === otherwise && path)
  }

  if (!otherwisePath) {
    outputConditions['otherwise'] = otherwise
    otherwisePath = 'otherwise'
  }

  // define the action
  let action = function when ({input, state, output}) {
    const pathValue = pathScheme.getValue(populateInputAndStateSchemes(input, state))
    let value

    if (pathScheme.target === 'input') {
      value = input[pathValue]
    } else if (pathScheme.target === 'state') {
      value = state.get(pathValue)
    }

    let outputPath

    for (let path in outputConditions) {
      let test = outputConditions[path]
      if (test !== otherwise &&
        ((test === value) || (test === truthy && value) || (test === falsy && !value))) {
        outputPath = path
        break
      }
    }

    output[outputPath || otherwisePath]()
  }

  action.outputs = Object.keys(outputConditions)

  action.displayName = `operator WHEN (${path})`

  return action
}

when.truthy = truthy
when.falsy = falsy
when.otherwise = otherwise

export default when
