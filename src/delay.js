export default function (time, continueChain) {
  const delay = function delay (args) {
    setTimeout(args.output.continue, time)
  }

  delay.async = true
  delay.outputs = ['continue']
  delay.displayName = `operator DELAY (${time})`

  if (continueChain) {
    return [
      delay, {
        continue: continueChain
      }
    ]
  }
  return delay
}
