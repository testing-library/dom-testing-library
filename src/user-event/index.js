import {fireEvent} from '..'
import {type} from './type'
import {tick} from './tick'

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

function clickLabel(label, init) {
  fireEvent.mouseOver(label, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(label, getMouseEventOptions('mousemove', init))
  fireEvent.mouseDown(label, getMouseEventOptions('mousedown', init))
  fireEvent.mouseUp(label, getMouseEventOptions('mouseup', init))
  fireEvent.click(label, getMouseEventOptions('click', init))

  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  if (label.control) label.control.focus()
}

function clickBooleanElement(element, init) {
  if (element.disabled) return

  fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init))
  fireEvent.focus(element)
  fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  fireEvent.click(element, getMouseEventOptions('click', init))
}

function clickElement(element, previousElement, init) {
  fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) previousElement.blur()
    if (shouldFocus) element.focus()
  }
  fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()
}

function dblClickElement(element, previousElement, init) {
  fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) previousElement.blur()
    if (shouldFocus) element.focus()
  }
  fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()

  fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init, 1))
  fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init, 1))
  fireEvent.click(element, getMouseEventOptions('click', init, 2))
  fireEvent.dblClick(element, getMouseEventOptions('dblclick', init, 2))
}

function dblClickCheckbox(checkbox, init) {
  fireEvent.mouseOver(checkbox, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(checkbox, getMouseEventOptions('mousemove', init))
  fireEvent.mouseDown(checkbox, getMouseEventOptions('mousedown', init))
  fireEvent.focus(checkbox)
  fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init))
  fireEvent.click(checkbox, getMouseEventOptions('click', init, 1))
  fireEvent.mouseDown(checkbox, getMouseEventOptions('mousedown', init, 1))
  fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init, 1))
  fireEvent.click(checkbox, getMouseEventOptions('click', init, 2))
}

function selectOption(select, option, init) {
  fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  fireEvent.focus(option)
  fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = true

  fireEvent.change(select)
}

function toggleSelectOption(select, option, init) {
  fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  fireEvent.focus(option)
  fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = !option.selected

  fireEvent.change(select)
}

const Keys = {
  Backspace: {keyCode: 8, code: 'Backspace', key: 'Backspace'},
}

function backspace(element) {
  const keyboardEventOptions = {
    key: Keys.Backspace.key,
    keyCode: Keys.Backspace.keyCode,
    which: Keys.Backspace.keyCode,
  }
  fireEvent.keyDown(element, keyboardEventOptions)
  fireEvent.keyUp(element, keyboardEventOptions)

  if (!element.readOnly) {
    fireEvent.input(element, {
      inputType: 'deleteContentBackward',
    })

    // We need to call `fireEvent.change` _before_ we change `element.value`
    // because `fireEvent.change` will use the element's native value setter
    // (meaning it will avoid prototype overrides implemented by React). If we
    // call `input.value = ""` first, React will swallow the change event (this
    // is checked in the tests). `fireEvent.change` will only call the native
    // value setter method if the event options include `{ target: { value }}`
    // (https://github.com/testing-library/dom-testing-library/blob/8846eaf20972f8e41ed11f278948ac38a692c3f1/src/events.js#L29-L32).
    //
    // Also, we still must call `element.value = ""` after calling
    // `fireEvent.change` because `fireEvent.change` will _only_ call the native
    // `value` setter and not the prototype override defined by React, causing
    // React's internal represetation of this state to get out of sync with the
    // value set on `input.value`; calling `element.value` after will also call
    // React's setter, keeping everything in sync.
    //
    // Comment either of these out or re-order them and see what parts of the
    // tests fail for more context.
    fireEvent.change(element, {target: {value: ''}})
    element.value = ''
  }
}

function selectAll(element) {
  dblClick(element) // simulate events (will not actually select)
  const elementType = element.type
  // type is a readonly property on textarea, so check if element is an input before trying to modify it
  if (isInputElement(element)) {
    // setSelectionRange is not supported on certain types of inputs, e.g. "number" or "email"
    element.type = 'text'
  }
  element.setSelectionRange(0, element.value.length)
  if (isInputElement(element)) {
    element.type = elementType
  }
}

function isInputElement(element) {
  return element.tagName.toLowerCase() === 'input'
}

function getPreviouslyFocusedElement(element) {
  const focusedElement = element.ownerDocument.activeElement
  const wasAnotherElementFocused =
    focusedElement &&
    focusedElement !== element.ownerDocument.body &&
    focusedElement !== element
  return wasAnotherElementFocused ? focusedElement : null
}

function click(element, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  switch (element.tagName) {
    case 'LABEL':
      clickLabel(element, init)
      break
    case 'INPUT':
      if (element.type === 'checkbox' || element.type === 'radio') {
        clickBooleanElement(element, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      clickElement(element, previouslyFocusedElement, init)
  }
}

function dblClick(element, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  switch (element.tagName) {
    case 'INPUT':
      if (element.type === 'checkbox') {
        dblClickCheckbox(element, previouslyFocusedElement, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      dblClickElement(element, previouslyFocusedElement, init)
  }
}

function selectOptions(element, values, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  clickElement(element, previouslyFocusedElement, init)

  const valArray = Array.isArray(values) ? values : [values]
  const selectedOptions = Array.from(element.querySelectorAll('option')).filter(
    opt => valArray.includes(opt.value) || valArray.includes(opt),
  )

  if (selectedOptions.length > 0) {
    if (element.multiple) {
      selectedOptions.forEach(option => selectOption(element, option))
    } else {
      selectOption(element, selectedOptions[0])
    }
  }
}

function toggleSelectOptions(element, values, init) {
  if (!element || element.tagName !== 'SELECT' || !element.multiple) {
    throw new Error(
      `Unable to toggleSelectOptions - please provide a select element with multiple=true`,
    )
  }

  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  clickElement(element, previouslyFocusedElement, init)

  const valArray = Array.isArray(values) ? values : [values]
  const selectedOptions = Array.from(element.querySelectorAll('option')).filter(
    opt => valArray.includes(opt.value) || valArray.includes(opt),
  )

  if (selectedOptions.length > 0) {
    selectedOptions.forEach(option => toggleSelectOption(element, option, init))
  }
}

function clear(element) {
  if (element.disabled) return

  selectAll(element)
  backspace(element)
}

function upload(element, fileOrFiles, {clickInit, changeInit} = {}) {
  if (element.disabled) return
  const focusedElement = element.ownerDocument.activeElement

  let files

  if (element.tagName === 'LABEL') {
    clickLabel(element)
    files = element.control.multiple ? fileOrFiles : [fileOrFiles]
  } else {
    files = element.multiple ? fileOrFiles : [fileOrFiles]
    clickElement(element, focusedElement, clickInit)
  }

  fireEvent.change(element, {
    target: {
      files: {
        length: files.length,
        item: index => files[index] || null,
        ...files,
      },
    },
    ...changeInit,
  })
}

function tab({shift = false, focusTrap = document} = {}) {
  const focusableElements = focusTrap.querySelectorAll(
    'input, button, select, textarea, a[href], [tabindex]',
  )

  const enabledElements = [...focusableElements].filter(
    el => el.getAttribute('tabindex') !== '-1' && !el.disabled,
  )

  if (enabledElements.length === 0) return

  const orderedElements = enabledElements
    .map((el, idx) => ({el, idx}))
    .sort((a, b) => {
      const tabIndexA = a.el.getAttribute('tabindex')
      const tabIndexB = b.el.getAttribute('tabindex')

      const diff = tabIndexA - tabIndexB

      return diff === 0 ? a.idx - b.idx : diff
    })
    .map(({el}) => el)

  if (shift) orderedElements.reverse()

  // keep only the checked or first element in each radio group
  const prunedElements = []
  for (const el of orderedElements) {
    if (el.type === 'radio' && el.name) {
      const replacedIndex = prunedElements.findIndex(
        ({name}) => name === el.name,
      )

      if (replacedIndex === -1) {
        prunedElements.push(el)
      } else if (el.checked) {
        prunedElements.splice(replacedIndex, 1)
        prunedElements.push(el)
      }
    } else {
      prunedElements.push(el)
    }
  }

  if (shift) prunedElements.reverse()

  const index = prunedElements.findIndex(
    el => el === el.ownerDocument.activeElement,
  )

  const nextIndex = shift ? index - 1 : index + 1
  const defaultIndex = shift ? prunedElements.length - 1 : 0

  const next = prunedElements[nextIndex] || prunedElements[defaultIndex]

  if (next.getAttribute('tabindex') === null) {
    next.setAttribute('tabindex', '0') // jsdom requires tabIndex=0 for an item to become 'document.activeElement'
    next.focus()
    next.removeAttribute('tabindex') // leave no trace. :)
  } else {
    next.focus()
  }
}

async function hover(element, init) {
  await tick()
  fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await tick()
  fireEvent.mouseEnter(element, getMouseEventOptions('mouseenter', init))
  await tick()
  fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
}

async function unhover(element, init) {
  await tick()
  fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  await tick()
  fireEvent.mouseOut(element, getMouseEventOptions('mouseout', init))
  await tick()
  fireEvent.mouseLeave(element, getMouseEventOptions('mouseleave', init))
}

const userEvent = {
  click,
  dblClick,
  selectOptions,
  toggleSelectOptions,
  clear,
  type,
  upload,
  tab,
  hover,
  unhover,
}

export default userEvent

/*
eslint
  max-depth: ["error", 6],
*/
