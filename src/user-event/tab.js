import {wrapAsync} from '../wrap-async'
import {tick} from './tick'

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

export {tab}
