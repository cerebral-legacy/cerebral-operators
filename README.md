# cerebral-operators [![Build Status](https://secure.travis-ci.org/cerebral/cerebral-operators.png?branch=master)](https://travis-ci.org/cerebral/cerebral-operators)

Common operators (actions) for Cerebral.

## Usage

```js
import set from 'cerebral/operators/set'
import unset from 'cerebral/operators/unset'
```

## Data paths

Cerebral operators allow you to set, copy, unset or check values across multiple data sources and
destinations. To simplify the mechanism of addressing these values cerebral operators uses URLs.

```
scheme:path
```

where `scheme` can be one of:

* `input` - (readonly)
* `state` - (readwrite)
* `output` - (writeonly)

the `path` is the location of data to get or set.

Cerebral will "pre-compile" these URLs into performant functions
so that at run time the URL does not need to be parsed. See the Factory Helpers section below
for information on how you can integrate these URLs into your own actions.

#### Examples

user name from the input (readonly) `{ user: { name: 'Brian' } }`
```
input:user.name
```

user name from the root of the store
```
state:user.name
```

user name to the output (writeonly)
```
output:user.name
```

## Action Factories

#### copy
Copies a value from input, global state or module state to output, global state or module state.

* `copy(from, to)`

```js
// copy serverSettings from input to the store at /settings
export default [
  [
    getServerSettings, {
      success: [
        copy('input:serverSettings', 'state:settings')
      ]
      error: []
    }
  ]
]
```

```js
// copy newAccount from account module state to output
export default [
  copy('state:account.newAccount', 'output:newAccount'),
  [
    ajax.post('/new-account'), {
      success: []
      error: []
    }
  ]
]
```

#### debounce

* `debounce(time, continueChain, { terminateChain = [], immediate = true, throttle = true })`

debounce can be used to limit the number a times an actionChain is called, for example on keyboard activity.

By default the first signal call will execute the continueChain immediately and the last call during the time
will execute at the end. To change this to only execute the most recent continueChain at the end, set the
options to `{ immediate: false }`.

It is also possible to pass a `terminateChain` to the options which will be called whenever a signal is terminated.

```js
export default [
  copy('input:value', 'state:form.field'),
  debounce(500, [
    validateForm
  ])
]
```

#### filter

* `filter(path, compare, acceptChain = null, options = { discardedChain: [] })`

filter accepts a path and compares the value at the path with `compare` value.

```js
export default [
  filter('input:user.isAdmin', true, [
    doAdminTasks
  ])
]
```

If `compare` is a function then it will be executed and should return a truthy/falsy value.

* compare function: `(value, context) => value === 'what I expected'`

```js
export default [
  filter('input:user', (user, { state }) => user.isAdmin && !user.name == 'Brian' && state.get('inAdminMode'), [
    doAdminTasks
  ])
]
```

#### set

* `set(path, value)`

```js
export default [
  set('state:isLoading', 'true'),
  [getOptionsFromServer, {
    success: [],
    error: []
  }],
  set('state:isLoading', 'false')
]
```

#### throttle

* `throttle(time, continueChain, { terminateChain = [] })`

throttle can be used to limit the number a times an actionChain is called, for example on keyboard activity.

It is also possible to pass a `terminateChain` to the options which will be called whenever a signal is terminated.

```js
export default [
  copy('input:value', 'state:form.field'),
  throttle(500, [
    validateForm
  ])
]
```

#### toggle

* `toggle(path)`

```js
// toggle the menu between true and false
export default [
  toggle('state:isMenuOpen')
]
```

```js
// toggle the switch between "On" and "Off"
export default [
  toggle('state:switch', 'On', 'Off')
]
```

#### unset

* `unset(path)`

```js
export default [
  unset('state:item')
]
```

#### delay

* `delay(time, continueChain)`

```js
export default [
  addItem,
  delay(500, [
    removeItemHighlight
  ])
]
```

#### when

When can be used to check input or state for a specific value, truthy or falsy and then run an action chain when the condition is matched. To check multiple paths, see the operators section below. If no `when.otherwise` condition is provided then an `otherwise` output path will be created for you.

* `when(path, conditions = { 'true': when.truthy, 'false': when.otherwise })`

when exports the following symbols

* `when.truthy`
* `when.falsy`
* `when.otherwise`

```js
// simple when using default outputs
export default [
  when('state:isLoading'), {
    true: [tryAgainLater],
    false: [doReload]
  }
]
```

```js
// create custom output path names
let whenUser = when('state:users.currentUser', {
  isLoggedIn: when.truthy,
  isUnknown: when.otherwise
})

export default [
  whenUser, {
    isLoggedIn: [getPageData],
    isUnknown: [redirectToHome]
  }
]
```

```js
// check for specific values
let whenFormIsValid = when('state:form.errorMessage', {
  valid: 'no errors found',
  invalid: when.otherwise
})

export default [
  validateForm,
  whenFormIsValid, {
    valid: [sendToServer],
    invalid: [showErrorSnackBarMessage]
  }
]
```

```js
// check for specific values against an array of possible matches
export default [
  when('input:actionType', [ 'close', 'open' ]), {
    close: [],
    open: [],
    otherwise: []
  }
]
```

## Contribute

Fork repo

* `npm install`
* `npm start` runs dev mode which watches for changes and auto lints, tests and builds
* `npm test` runs the tests
* `npm run lint` lints the code
* `npm run build` compiles es6 to es5
