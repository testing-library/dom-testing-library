import {wrapAsync} from '../wrap-async'
import {fireEvent, getActiveElement, FOCUSABLE_SELECTOR} from './utils'
import {focus} from './focus'
import {blur} from './blur'

async function tab({shift = false, focusTrap} = {}) {
  const previousElement = getActiveElement(focusTrap?.ownerDocument ?? document)

  if (!focusTrap) {
    focusTrap = document
  }

  const focusableElements = focusTrap.querySelectorAll(FOCUSABLE_SELECTOR)

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

  const nextElement = prunedElements[nextIndex] || prunedElements[defaultIndex]

  const shiftKeyInit = {
    key: 'Shift',
    keyCode: 16,
    shiftKey: true,
  }
  const tabKeyInit = {
    key: 'Tab',
    keyCode: 9,
    shiftKey: shift,
  }

  let continueToTab = true

  // not sure how to make it so there's no previous element...
  // istanbul ignore else
  if (previousElement) {
    // preventDefault on the shift key makes no difference
    if (shift) await fireEvent.keyDown(previousElement, {...shiftKeyInit})
    continueToTab = await fireEvent.keyDown(previousElement, {...tabKeyInit})
    if (continueToTab) {
      await blur(previousElement)
    }
  }

  const keyUpTarget =
    !continueToTab && previousElement ? previousElement : nextElement

  if (continueToTab) {
    const hasTabIndex = nextElement.getAttribute('tabindex') !== null
    if (!hasTabIndex) {
      nextElement.setAttribute('tabindex', '0') // jsdom requires tabIndex=0 for an item to become 'document.activeElement'
    }

    await focus(nextElement)

    if (!hasTabIndex) {
      nextElement.removeAttribute('tabindex') // leave no trace. :)
    }
  }

  await fireEvent.keyUp(keyUpTarget, {...tabKeyInit})

  if (shift) {
    await fireEvent.keyUp(keyUpTarget, {...shiftKeyInit, shiftKey: false})
  }
}
tab = wrapAsync(tab)

export {tab}

/*
eslint
  complexity: "off",
  max-statements: "off",
*/
