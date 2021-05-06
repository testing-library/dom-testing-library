import {Nullish} from '../types'
import {TEXT_NODE} from './helpers'

const labelledNodeNames = [
  'button',
  'meter',
  'output',
  'progress',
  'select',
  'textarea',
  'input',
]

function getTextContent(
  node: Element | HTMLInputElement | Node,
): string | null {
  if (labelledNodeNames.includes(node.nodeName.toLowerCase())) {
    return ''
  }

  if (node.nodeType === TEXT_NODE) return node.textContent

  return Array.from(node.childNodes)
    .map(childNode => getTextContent(childNode))
    .join('')
}

function getLabelContent(element: Element): Nullish<string> {
  let textContent: string | null
  if (element.tagName.toLowerCase() === 'label') {
    textContent = getTextContent(element)
  } else {
    textContent = (element as HTMLInputElement).value || element.textContent
  }
  return textContent
}

// Based on https://github.com/eps1lon/dom-accessibility-api/pull/352
function getRealLabels(element: Element) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- types are not aware of older browsers that don't implement `labels`
  if ((element as HTMLInputElement).labels !== undefined) {
    return (element as HTMLInputElement).labels ?? []
  }

  if (!isLabelable(element)) return []

  const labels = element.ownerDocument.querySelectorAll('label')
  return Array.from(labels).filter(label => label.control === element)
}

function isLabelable(element: Element) {
  return (
    /BUTTON|METER|OUTPUT|PROGRESS|SELECT|TEXTAREA/.test(element.tagName) ||
    (element.tagName === 'INPUT' && element.getAttribute('type') !== 'hidden')
  )
}

function getLabels(
  container: Element,
  element: Element,
  {selector = '*'} = {},
): {content: Nullish<string>; formControl: Nullish<HTMLElement>}[] {
  const ariaLabelledBy = element.getAttribute('aria-labelledby')
  const labelsId = ariaLabelledBy ? ariaLabelledBy.split(' ') : []
  return labelsId.length
    ? labelsId.map(labelId => {
        const labellingElement = container.querySelector<HTMLElement>(
          `[id="${labelId}"]`,
        )
        return labellingElement
          ? {content: getLabelContent(labellingElement), formControl: null}
          : {content: '', formControl: null}
      })
    : Array.from(getRealLabels(element)).map(label => {
        const textToMatch = getLabelContent(label)
        const formControlSelector =
          'button, input, meter, output, progress, select, textarea'
        const labelledFormControl = Array.from(
          label.querySelectorAll<HTMLElement>(formControlSelector),
        ).filter(formControlElement => formControlElement.matches(selector))[0]
        return {content: textToMatch, formControl: labelledFormControl}
      })
}

export {getLabels, getRealLabels, getLabelContent}
