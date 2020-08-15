// We try to load node dependencies
let readFileSync = null
let codeFrameColumns = null

try {
  const nodeRequire = module && module.require
  readFileSync = nodeRequire.call(module, 'fs').readFileSync
  codeFrameColumns = nodeRequire.call(module, '@babel/code-frame')
    .codeFrameColumns
} catch {
  // We're in a browser environment
  console.warn(
    'Printing the user trace is not supported in a browser environment',
  )
}

// frame has the form "at myMethod (location/to/my/file.js:10:2)"
function getCodeFrame(frame) {
  const locationStart = frame.indexOf('(') + 1
  const locationEnd = frame.indexOf(')')
  const frameLocation = frame.slice(locationStart, locationEnd)

  const frameLocationElements = frameLocation.split(':')
  const [filename, line, column] = [
    frameLocationElements[0],
    parseInt(frameLocationElements[1], 10),
    parseInt(frameLocationElements[2], 10),
  ]

  let rawFileContents = ''
  try {
    rawFileContents = readFileSync(filename, 'utf-8')
  } catch {
    console.warn(`Couldn't read file ${filename} for displaying the code frame`)
    return ''
  }

  const codeFrame = codeFrameColumns(
    rawFileContents,
    {
      start: {line, column},
    },
    {
      highlightCode: true,
      linesBelow: 0,
    },
  )
  return `${codeFrame}\n`
}

function getUserTrace() {
  // If we couldn't load dependencies, we can't generate a user trace
  if (!readFileSync || !codeFrameColumns) {
    return ''
  }
  const err = new Error()
  const firstClientCodeFrame = err.stack
    .split('\n')
    .slice(1) // Remove first line which has the form "Error: TypeError"
    .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

  return getCodeFrame(firstClientCodeFrame)
}

export {getUserTrace}
