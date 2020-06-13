import {wrapAsync} from '../wrap-async'
import {
  fireEvent,
  getMouseEventOptions,
  isLabelWithInternallyDisabledControl,
} from './utils'
import {hover} from './hover'
import {blur} from './blur'
import {focus} from './focus'

function getPreviouslyFocusedElement(element) {
  const focusedElement = element.ownerDocument.activeElement
  const wasAnotherElementFocused =
    focusedElement &&
    focusedElement !== element.ownerDocument.body &&
    focusedElement !== element
  return wasAnotherElementFocused ? focusedElement : null
}

async function clickLabel(label, init, {clickCount}) {
  if (isLabelWithInternallyDisabledControl(label)) return

  await fireEvent.pointerDown(label, init)
  await fireEvent.mouseDown(
    label,
    getMouseEventOptions('mousedown', init, clickCount),
  )
  await fireEvent.pointerUp(label, init)
  await fireEvent.mouseUp(
    label,
    getMouseEventOptions('mouseup', init, clickCount),
  )
  await fireEvent.click(label, getMouseEventOptions('click', init, clickCount))
  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  if (label.control) await focus(label.control)
}

async function clickBooleanElement(element, init, clickCount) {
  await fireEvent.pointerDown(element, init)
  if (!element.disabled) {
    await fireEvent.mouseDown(
      element,
      getMouseEventOptions('mousedown', init, clickCount),
    )
  }
  await focus(element, init)
  await fireEvent.pointerUp(element, init)
  if (!element.disabled) {
    await fireEvent.mouseUp(
      element,
      getMouseEventOptions('mouseup', init, clickCount),
    )
    await fireEvent.click(
      element,
      getMouseEventOptions('click', init, clickCount),
    )
  }
}

async function clickElement(element, init, {clickCount}) {
  const previousElement = getPreviouslyFocusedElement(element)
  await fireEvent.pointerDown(element, init)
  if (!element.disabled) {
    const continueDefaultHandling = await fireEvent.mouseDown(
      element,
      getMouseEventOptions('mousedown', init, clickCount),
    )
    const shouldFocus = element.ownerDocument.activeElement !== element
    if (continueDefaultHandling) {
      if (previousElement) await blur(previousElement, init)
      if (shouldFocus) await focus(element, init)
    }
  }
  await fireEvent.pointerUp(element, init)
  if (!element.disabled) {
    await fireEvent.mouseUp(
      element,
      getMouseEventOptions('mouseup', init, clickCount),
    )
    await fireEvent.click(
      element,
      getMouseEventOptions('click', init, clickCount),
    )
    const parentLabel = element.closest('label')
    if (parentLabel?.control) await focus(parentLabel.control, init)
  }
}

async function click(element, init, {skipHover = false, clickCount = 0} = {}) {
  if (!skipHover) await hover(element, init)
  switch (element.tagName) {
    case 'LABEL':
      await clickLabel(element, init, {clickCount})
      break
    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        await clickBooleanElement(element, init, {clickCount})
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await clickElement(element, init, {clickCount})
  }
}
click = wrapAsync(click)

async function dblClick(element, init) {
  await hover(element, init)
  await click(element, init, {skipHover: true, clickCount: 0})
  await click(element, init, {skipHover: true, clickCount: 1})
  await fireEvent.dblClick(element, getMouseEventOptions('dblclick', init, 2))
}
dblClick = wrapAsync(dblClick)

export {click, dblClick}
