import {compressToEncodedURIComponent} from 'lz-string'

function unindent(value: string) {
  // remove white spaces first, to save a few bytes.
  // testing-playground will reformat on load any ways.
  return value.replace(/[ \t]*[\n][ \t]*/g, '\n')
}

function encode(value: string) {
  return compressToEncodedURIComponent(unindent(value))
}

function getPlaygroundUrl(element: Element) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!element) {
    throw new Error(`The element you're providing isn't a valid DOM element.`)
  }

  if (!element.innerHTML) {
    throw new Error(`The provided element doesn't have any children.`)
  }

  return `https://testing-playground.com/#markup=${encode(element.innerHTML)}`
}

export {getPlaygroundUrl}
