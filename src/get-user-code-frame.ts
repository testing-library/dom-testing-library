// We try to load node dependencies
let chalk: {dim: Function} | null = null
let readFileSync: Function | null = null
let codeFrameColumns: Function | null = null

try {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const nodeRequire = module?.require

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
  readFileSync = nodeRequire.call(module, 'fs').readFileSync
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
  codeFrameColumns = nodeRequire.call(module, '@babel/code-frame')
    .codeFrameColumns
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  chalk = nodeRequire.call(module, 'chalk')
} catch {
  // We're in a browser environment
}

// frame has the form "at myMethod (location/to/my/file.js:10:2)"
function getCodeFrame(frame: string) {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    rawFileContents = readFileSync?.(filename, 'utf-8')
  } catch {
    return ''
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const codeFrame = codeFrameColumns?.(
    rawFileContents,
    {
      start: {line, column},
    },
    {
      highlightCode: true,
      linesBelow: 0,
    },
  )
  return `${chalk?.dim(frameLocation)}\n${codeFrame}\n`
}

function getUserCodeFrame() {
  // If we couldn't load dependencies, we can't generate the user trace
  /* istanbul ignore next */
  if (!readFileSync || !codeFrameColumns) {
    return ''
  }
  const err: Error = new Error()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const firstClientCodeFrame: string | undefined = err.stack
    .split('\n')
    .slice(1) // Remove first line which has the form "Error: TypeError"
    .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

  return getCodeFrame(firstClientCodeFrame ?? '')
}

export {getUserCodeFrame}
