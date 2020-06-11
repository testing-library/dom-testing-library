import {fireEvent as baseFireEvent} from '../events'
import {tick} from './tick'

async function fireEvent(...args) {
  await tick()
  return baseFireEvent(...args)
}

Object.keys(baseFireEvent).forEach(key => {
  async function asyncFireEventWrapper(...args) {
    await tick()
    return baseFireEvent[key](...args)
  }
  Object.defineProperty(asyncFireEventWrapper, 'name', {value: key})
  fireEvent[key] = asyncFireEventWrapper
})

function isInputElement(element) {
  return element.tagName.toLowerCase() === 'input'
}

function isMousePressEvent(event) {
  return (
    event === 'mousedown' ||
    event === 'mouseup' ||
    event === 'click' ||
    event === 'dblclick'
  )
}

function invert(map) {
  const res = {}
  for (const key of Object.keys(map)) {
    res[map[key]] = key
  }

  return res
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
const BUTTONS_TO_NAMES = {
  0: 'none',
  1: 'primary',
  2: 'secondary',
  4: 'auxiliary',
}
const NAMES_TO_BUTTONS = invert(BUTTONS_TO_NAMES)

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const BUTTON_TO_NAMES = {
  0: 'primary',
  1: 'auxiliary',
  2: 'secondary',
}

const NAMES_TO_BUTTON = invert(BUTTON_TO_NAMES)

function convertMouseButtons(event, init, property, mapping) {
  if (!isMousePressEvent(event)) {
    return 0
  }

  if (init[property] != null) {
    return init[property]
  }

  if (init.buttons != null) {
    return mapping[BUTTONS_TO_NAMES[init.buttons]] || 0
  }

  if (init.button != null) {
    return mapping[BUTTON_TO_NAMES[init.button]] || 0
  }

  return property != 'button' && isMousePressEvent(event) ? 1 : 0
}

function getMouseEventOptions(event, init, clickCount = 0) {
  init = init || {}
  return {
    ...init,
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    detail:
      event === 'mousedown' || event === 'mouseup'
        ? 1 + clickCount
        : clickCount,
    buttons: convertMouseButtons(event, init, 'buttons', NAMES_TO_BUTTONS),
    button: convertMouseButtons(event, init, 'button', NAMES_TO_BUTTON),
  }
}

function getPreviouslyFocusedElement(element) {
  const focusedElement = element.ownerDocument.activeElement
  const wasAnotherElementFocused =
    focusedElement &&
    focusedElement !== element.ownerDocument.body &&
    focusedElement !== element
  return wasAnotherElementFocused ? focusedElement : null
}

export {
  fireEvent,
  isInputElement,
  getMouseEventOptions,
  getPreviouslyFocusedElement,
}
