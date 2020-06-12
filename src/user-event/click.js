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

async function clickLabel(label, init) {
  if (isLabelWithInternallyDisabledControl(label)) return

  await fireEvent.pointerDown(label, init)
  await fireEvent.mouseDown(label, getMouseEventOptions('mousedown', init))
  await fireEvent.pointerUp(label, init)
  await fireEvent.mouseUp(label, getMouseEventOptions('mouseup', init))
  await fireEvent.click(label, getMouseEventOptions('click', init))
  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  if (label.control) await focus(label.control)
}

async function clickBooleanElement(element, init) {
  await fireEvent.pointerDown(element, init)
  if (!element.disabled) {
    await fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init))
  }
  await focus(element, init)
  await fireEvent.pointerUp(element, init)
  if (!element.disabled) {
    await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
    await fireEvent.click(element, getMouseEventOptions('click', init))
  }
}

async function clickElement(element, init) {
  const previousElement = getPreviouslyFocusedElement(element)
  await fireEvent.pointerDown(element, init)
  if (!element.disabled) {
    const continueDefaultHandling = await fireEvent.mouseDown(
      element,
      getMouseEventOptions('mousedown', init),
    )
    const shouldFocus = element.ownerDocument.activeElement !== element
    if (continueDefaultHandling) {
      if (previousElement) await blur(previousElement, init)
      if (shouldFocus) await focus(element, init)
    }
  }
  await fireEvent.pointerUp(element, init)
  if (!element.disabled) {
    await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
    await fireEvent.click(element, getMouseEventOptions('click', init, 1))
    const parentLabel = element.closest('label')
    if (parentLabel?.control) parentLabel?.control.focus?.()
  }
}

async function dblClickElement(element, init) {
  const previousElement = getPreviouslyFocusedElement(element)
  const continueDefaultHandling = await fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) await blur(previousElement, init)
    if (shouldFocus) await focus(element, init)
  }
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()

  await fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init, 1))
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init, 1))
  await fireEvent.click(element, getMouseEventOptions('click', init, 2))
  await fireEvent.dblClick(element, getMouseEventOptions('dblclick', init, 2))
}

async function dblClickCheckbox(checkbox, init) {
  await fireEvent.mouseOver(checkbox, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(checkbox, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(checkbox, getMouseEventOptions('mousedown', init))
  await focus(checkbox, init)
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 1))
  await fireEvent.mouseDown(
    checkbox,
    getMouseEventOptions('mousedown', init, 1),
  )
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init, 1))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 2))
}

async function click(element, init) {
  await hover(element, init)
  switch (element.tagName) {
    case 'LABEL':
      await clickLabel(element, init)
      break
    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        await clickBooleanElement(element, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await clickElement(element, init)
  }
}
click = wrapAsync(click)

async function dblClick(element, init) {
  await hover(element, init)
  switch (element.tagName) {
    case 'INPUT':
      if (element.type === 'checkbox') {
        await dblClickCheckbox(element, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await dblClickElement(element, init)
  }
}
dblClick = wrapAsync(dblClick)

export {
  click,
  dblClick,
  clickLabel,
  clickBooleanElement,
  clickElement,
  dblClickElement,
  dblClickCheckbox,
}
