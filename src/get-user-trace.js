import fs from 'fs'
import { codeFrameColumns } from '@babel/code-frame';

// Frame has the form "at myMethod (location/to/my/file.js:10:2)"
function getCodeFrame(frame) {
  const locationStart = frame.indexOf('(') + 1
  const locationEnd = frame.indexOf(')')
  const frameLocation = frame.slice(locationStart, locationEnd)

  const frameLocationElements = frameLocation.split(":")
  const [filename, line, column] = [frameLocationElements[0], parseInt(frameLocationElements[1], 10), parseInt(frameLocationElements[2], 10)]
  let rawFileContents = ""
  try {
    rawFileContents = fs.readFileSync(filename, 'utf-8')
  } catch {
    console.warn(`Couldn't read file ${filename} for displaying the code frame`)
  }
  return codeFrameColumns(rawFileContents, {
    start: { line, column },
  }, {
    highlightCode: true,
    linesBelow: 0,
  })
}

function getUserTrace() {
  const err = new Error()
  const firstClientCodeFrame = err.stack
    .split('\n')
    .slice(1) // Remove first line which has the form "Error: TypeError"
    .find(frame => !frame.includes('node_modules/')) // Ignore frames from 3rd party libraries

  return `${getCodeFrame(firstClientCodeFrame)}\n`
}

export {getUserTrace}
