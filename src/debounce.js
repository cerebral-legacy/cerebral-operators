const pending = {}

export default function (time = 100, acceptedChain = null, options = null) {
  const id = Symbol('id')

  if (options === null && !Array.isArray(acceptedChain)) {
    options = acceptedChain
    acceptedChain = null
  }

  const {
    discardedChain = [],
    immediate = false,
    throttle = false
  } = (options || {})

  const timeout = function debounceTimeout () {
    if (pending[id].accepted) {
      // continue the final signal
      pending[id].accepted()
      // immediate debounce should wait until time before sending immediate again
      if (immediate) {
        pending[id] = {
          timeout: setTimeout(timeout, time)
        }
      } else {
        delete pending[id]
      }
    } else {
      // no pending signals
      delete pending[id]
    }
  }

  const debounce = function debounce ({ output }) {
    if (pending[id]) {
      // not first time
      if (pending[id].discarded) {
        // discard the previous signal
        pending[id].discarded()

        // convert from throttle to a debounce
        // todo: this flag should eventually be removed
        if (!throttle) {
          clearTimeout(pending[id].timeout)
          pending[id] = {
            timeout: setTimeout(timeout, time)
          }
        }
      }
      // replace previous signal with this one
      pending[id].accepted = output.accepted
      pending[id].discarded = output.discarded
    } else {
      // first time
      pending[id] = {
        timeout: setTimeout(timeout, time)
      }
      if (!immediate) {
        // queue the signal
        pending[id].accepted = output.accepted
        pending[id].discarded = output.discarded
      } else {
        // accept the signal
        output.accepted()
      }
    }
  }

  debounce.async = true

  debounce.outputs = [
    'accepted',
    'discarded'
  ]

  debounce.displayName = `operator ${throttle ? 'THROTTLE' : 'DEBOUNCE'} (${time})`

  return !acceptedChain ? debounce : [
    debounce, {
      accepted: acceptedChain,
      discarded: discardedChain
    }
  ]
}
