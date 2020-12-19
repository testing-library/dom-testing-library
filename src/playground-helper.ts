import {compressToEncodedURIComponent} from 'lz-string'

function unindent(value: string) {
  // remove white spaces first, to save a few bytes.
  // testing-playground will reformat on load any ways.
  return value.replace(/[ \t]*[\n][ \t]*/g, '\n')
}

function encode(value: string) {
  return compressToEncodedURIComponent(unindent(value))
}

function getPlaygroundUrl(element: Element | null, logErrors = true) {
  if (!element || !('innerHTML' in element)) {
    if (logErrors) {
      console.log(`The element you're providing isn't a valid DOM element.`)
    }
    return null
  }

  if (!element.innerHTML) {
    if (logErrors) {
      console.log(`The provided element doesn't have any children.`)
    }
    return null
  }

  return `https://testing-playground.com/#markup=${encode(element.innerHTML)}`
}

export {getPlaygroundUrl}
