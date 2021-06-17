// type-only imports get erased at runtime
import type FS from 'fs'
import type {Chalk} from 'chalk'
import type {codeFrameColumns as CodeFrameColumnsFn} from '@babel/code-frame'

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

  // use require() instead of a top-level import for Node dependencies
  // so that errors thrown when called in a browser environment can be caught and handled.
  // expect to throw errors here and catch them in `getUserCodeFrame`.

  const {readFileSync} = module.require('fs') as typeof FS
  const rawFileContents = readFileSync(filename, 'utf-8')

  const {codeFrameColumns} = module.require('@babel/code-frame') as {
    codeFrameColumns: typeof CodeFrameColumnsFn
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

  const chalk = module.require('chalk') as Chalk

  return `${chalk.dim(frameLocation)}\n${codeFrame}\n`
}

function getUserCodeFrame(): string {
  try {
    const err = new Error()
    const firstClientCodeFrame = err.stack
      ?.split('\n')
      .slice(1) // Remove first line which has the form "Error: TypeError"
      .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

    /* istanbul ignore next */
    if (!firstClientCodeFrame) return ''
    return getCodeFrame(firstClientCodeFrame)
  } catch {
    // Expect to throw and catch errors when in the browser
    // If we couldn't load dependencies, we can't generate the user trace
    return ''
  }
}

export {getUserCodeFrame}
