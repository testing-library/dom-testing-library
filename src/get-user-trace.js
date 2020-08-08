import chalk from 'chalk'

// Frame has the form "at myMethod (location/to/my/file.js:10:2)"
function getFrameLocation(frame) {
  const locationStart = frame.indexOf('(') + 1
  const locationEnd = frame.indexOf(')')

  return frame.slice(locationStart, locationEnd)
}

function getUserTrace() {
  const err = new Error()
  const firstClientCodeFrame = err.stack
    .split('\n')
    .slice(1) // Remove first line which has the form "Error: TypeError"
    .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

  return chalk.gray(`${getFrameLocation(firstClientCodeFrame)}\n`)
}

export {getUserTrace}
