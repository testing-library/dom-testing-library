import {wrapAsync} from '../wrap-async'
import {fireEvent} from './tick-fire-event'
import {isInputElement} from './utils'
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

async function clickLabel(label, init) {
  await fireEvent.mouseOver(label, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(label, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(label, getMouseEventOptions('mousedown', init))
  await fireEvent.mouseUp(label, getMouseEventOptions('mouseup', init))
  await fireEvent.click(label, getMouseEventOptions('click', init))

  // clicking the label will trigger a click of the label.control
  // however, it will not focus the label.control so we have to do it
  // ourselves.
  if (label.control) label.control.focus()
}

async function clickBooleanElement(element, init) {
  if (element.disabled) return

  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(element, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(element)
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init))
}

async function clickElement(element, previousElement, init) {
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = await fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) previousElement.blur()
    if (shouldFocus) element.focus()
  }
  await fireEvent.mouseUp(element, getMouseEventOptions('mouseup', init))
  await fireEvent.click(element, getMouseEventOptions('click', init, 1))
  const parentLabel = element.closest('label')
  if (parentLabel?.control) parentLabel?.control.focus?.()
}

async function dblClickElement(element, previousElement, init) {
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  const continueDefaultHandling = await fireEvent.mouseDown(
    element,
    getMouseEventOptions('mousedown', init),
  )
  const shouldFocus = element.ownerDocument.activeElement !== element
  if (continueDefaultHandling) {
    if (previousElement) previousElement.blur()
    if (shouldFocus) element.focus()
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
  await fireEvent.focus(checkbox)
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 1))
  await fireEvent.mouseDown(
    checkbox,
    getMouseEventOptions('mousedown', init, 1),
  )
  await fireEvent.mouseUp(checkbox, getMouseEventOptions('mouseup', init, 1))
  await fireEvent.click(checkbox, getMouseEventOptions('click', init, 2))
}

async function selectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = true

  await fireEvent.change(select)
}

async function toggleSelectOption(select, option, init) {
  await fireEvent.mouseOver(option, getMouseEventOptions('mouseover', init))
  await fireEvent.mouseMove(option, getMouseEventOptions('mousemove', init))
  await fireEvent.mouseDown(option, getMouseEventOptions('mousedown', init))
  await fireEvent.focus(option)
  await fireEvent.mouseUp(option, getMouseEventOptions('mouseup', init))
  await fireEvent.click(option, getMouseEventOptions('click', init, 1))

  option.selected = !option.selected

  await fireEvent.change(select)
}

const Keys = {
  Backspace: {keyCode: 8, code: 'Backspace', key: 'Backspace'},
}

async function backspace(element) {
  const keyboardEventOptions = {
    key: Keys.Backspace.key,
    keyCode: Keys.Backspace.keyCode,
    which: Keys.Backspace.keyCode,
  }
  await fireEvent.keyDown(element, keyboardEventOptions)
  await fireEvent.keyUp(element, keyboardEventOptions)

  if (!element.readOnly) {
    await fireEvent.input(element, {
      inputType: 'deleteContentBackward',
    })

    // We need to call `await fireEvent.change` _before_ we change `element.value`
    // because `await fireEvent.change` will use the element's native value setter
    // (meaning it will avoid prototype overrides implemented by React). If we
    // call `input.value = ""` first, React will swallow the change event (this
    // is checked in the tests). `await fireEvent.change` will only call the native
    // value setter method if the event options include `{ target: { value }}`
    // (https://github.com/testing-library/dom-testing-library/blob/8846eaf20972f8e41ed11f278948ac38a692c3f1/src/events.js#L29-L32).
    //
    // Also, we still must call `element.value = ""` after calling
    // `await fireEvent.change` because `await fireEvent.change` will _only_ call the native
    // `value` setter and not the prototype override defined by React, causing
    // React's internal represetation of this state to get out of sync with the
    // value set on `input.value`; calling `element.value` after will also call
    // React's setter, keeping everything in sync.
    //
    // Comment either of these out or re-order them and see what parts of the
    // tests fail for more context.
    await fireEvent.change(element, {target: {value: ''}})
    element.value = ''
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

async function click(element, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    await fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    await fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

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
      await clickElement(element, previouslyFocusedElement, init)
  }
}
click = wrapAsync(click)

async function dblClick(element, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    await fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    await fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  switch (element.tagName) {
    case 'INPUT':
      if (element.type === 'checkbox') {
        await dblClickCheckbox(element, previouslyFocusedElement, init)
        break
      }
    // eslint-disable-next-line no-fallthrough
    default:
      await dblClickElement(element, previouslyFocusedElement, init)
  }
}
dblClick = wrapAsync(dblClick)

async function selectOptions(element, values, init) {
  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    await fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    await fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  await clickElement(element, previouslyFocusedElement, init)

  const valArray = Array.isArray(values) ? values : [values]
  const selectedOptions = Array.from(element.querySelectorAll('option')).filter(
    opt => valArray.includes(opt.value) || valArray.includes(opt),
  )

  if (selectedOptions.length > 0) {
    if (element.multiple) {
      for (const option of selectedOptions) {
        await selectOption(element, option)
      }
    } else {
      await selectOption(element, selectedOptions[0])
    }
  }
}
selectOptions = wrapAsync(selectOptions)

async function toggleSelectOptions(element, values, init) {
  if (!element || element.tagName !== 'SELECT' || !element.multiple) {
    throw new Error(
      `Unable to toggleSelectOptions - please provide a select element with multiple=true`,
    )
  }

  const previouslyFocusedElement = getPreviouslyFocusedElement(element)
  if (previouslyFocusedElement) {
    await fireEvent.mouseMove(
      previouslyFocusedElement,
      getMouseEventOptions('mousemove', init),
    )
    await fireEvent.mouseLeave(
      previouslyFocusedElement,
      getMouseEventOptions('mouseleave', init),
    )
  }

  await clickElement(element, previouslyFocusedElement, init)

  const valArray = Array.isArray(values) ? values : [values]
  const selectedOptions = Array.from(element.querySelectorAll('option')).filter(
    opt => valArray.includes(opt.value) || valArray.includes(opt),
  )

  if (selectedOptions.length > 0) {
    for (const option of selectedOptions) {
      await toggleSelectOption(element, option, init)
    }
  }
}
toggleSelectOptions = wrapAsync(toggleSelectOptions)

async function upload(element, fileOrFiles, {clickInit, changeInit} = {}) {
  if (element.disabled) return
  const focusedElement = element.ownerDocument.activeElement

  let files

  if (element.tagName === 'LABEL') {
    await clickLabel(element)
    files = element.control.multiple ? fileOrFiles : [fileOrFiles]
  } else {
    files = element.multiple ? fileOrFiles : [fileOrFiles]
    await clickElement(element, focusedElement, clickInit)
  }

  await fireEvent.change(element, {
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
upload = wrapAsync(upload)

async function tab({shift = false, focusTrap = document} = {}) {
  // everything in user-event must be actually async, but since we're not
  // calling fireEvent in here, we'll add this tick here...
  await tick()

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
tab = wrapAsync(tab)

async function hover(element, init) {
  await tick()
  await fireEvent.mouseOver(element, getMouseEventOptions('mouseover', init))
  await tick()
  await fireEvent.mouseEnter(element, getMouseEventOptions('mouseenter', init))
  await tick()
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
}
hover = wrapAsync(hover)

async function unhover(element, init) {
  await tick()
  await fireEvent.mouseMove(element, getMouseEventOptions('mousemove', init))
  await tick()
  await fireEvent.mouseOut(element, getMouseEventOptions('mouseout', init))
  await tick()
  await fireEvent.mouseLeave(element, getMouseEventOptions('mouseleave', init))
}
unhover = wrapAsync(unhover)

export {
  click,
  dblClick,
  selectOptions,
  toggleSelectOptions,
  type,
  upload,
  tab,
  hover,
  unhover,
}
export {clear} from './clear'

/*
eslint
  max-depth: ["error", 6],
*/
