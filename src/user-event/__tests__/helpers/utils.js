// this is pretty helpful:
// https://jsbin.com/nimelileyo/edit?js,output

// all of the stuff below is complex magic that makes the simpler tests work
// sorrynotsorry...

const unstringSnapshotSerializer = {
  test: val => typeof val === 'string',
  print: val => val,
}

expect.addSnapshotSerializer(unstringSnapshotSerializer)

function setup(ui, {eventHandlers} = {}) {
  const div = document.createElement('div')
  div.innerHTML = ui.trim()
  document.body.append(div)

  const element = div.firstChild

  return {element, ...addListeners(element, {eventHandlers})}
}

function setupSelect({multiple = false} = {}) {
  const form = document.createElement('form')
  form.innerHTML = `
    <select name="select" ${multiple ? 'multiple' : ''}>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  `
  document.body.append(form)
  const select = form.querySelector('select')
  const options = Array.from(form.querySelectorAll('option'))
  return {
    ...addListeners(select),
    form,
    select,
    options,
  }
}

let eventListeners = []

function getTestData(element, event) {
  return {
    bubbledFrom:
      event && event.eventPhase === event.BUBBLING_PHASE
        ? getElementDisplayName(event.target)
        : null,
    value: element.value,
    selectionStart: element.selectionStart,
    selectionEnd: element.selectionEnd,
    checked: element.checked,
  }
}

// asside from the hijacked listener stuff here, it's also important to call
// this function rather than simply calling addEventListener yourself
// because it adds your listener to an eventListeners array which is cleaned
// up automatically which will help use avoid memory leaks.
function addEventListener(el, type, listener, options) {
  el.previousTestData = getTestData(el)
  const hijackedListener = e => {
    e.testData = {previous: e.target.previousTestData}
    const retVal = listener(e)
    const next = getTestData(e.target, e)
    e.testData.next = next
    e.target.previousTestData = next
    return retVal
  }
  eventListeners.push({el, type, listener: hijackedListener})
  el.addEventListener(type, hijackedListener, options)
}

function getElementValue(element) {
  if (element.tagName === 'SELECT' && element.multiple) {
    return JSON.stringify(Array.from(element.selectedOptions).map(o => o.value))
  } else if (
    element.type === 'checkbox' ||
    element.type === 'radio' ||
    element.tagName === 'BUTTON'
  ) {
    // handled separately
    return null
  }
  return JSON.stringify(element.value)
}

function getElementDisplayName(element) {
  const value = getElementValue(element)
  const hasChecked = element.type === 'checkbox' || element.type === 'radio'
  return [
    element.tagName.toLowerCase(),
    element.id ? `#${element.id}` : null,
    element.name ? `[name="${element.name}"]` : null,
    element.htmlFor ? `[for="${element.htmlFor}"]` : null,
    value ? `[value=${value}]` : null,
    hasChecked ? `[checked=${element.checked}]` : null,
  ]
    .filter(Boolean)
    .join('')
}

function addListeners(element, {eventHandlers = {}} = {}) {
  const generalListener = jest.fn().mockName('eventListener')
  const listeners = [
    'submit',
    'keydown',
    'keyup',
    'keypress',
    'input',
    'change',
    'blur',
    'focus',
    'focusin',
    'focusout',
    'click',
    'dblclick',
    'mouseover',
    'mousemove',
    'mouseenter',
    'mouseleave',
    'mouseup',
    'mousedown',
  ]

  for (const name of listeners) {
    addEventListener(element, name, (...args) => {
      const [, handler] =
        Object.entries(eventHandlers).find(
          ([key]) => key.toLowerCase() === name,
        ) ?? []
      if (handler) {
        generalListener(...args)
        return handler(...args)
      }
      return generalListener(...args)
    })
  }
  // prevent default of submits in tests
  if (element.tagName === 'FORM') {
    addEventListener(element, 'submit', e => e.preventDefault())
  }
  function getEventCalls() {
    const eventCalls = generalListener.mock.calls
      .map(([event]) => {
        const window = event.target.ownerDocument.defaultView
        const modifiers = ['altKey', 'shiftKey', 'metaKey', 'ctrlKey']
          .filter(key => event[key])
          .map(k => `{${k.replace('Key', '')}}`)
          .join('')

        let log = event.type
        if (
          event.type === 'click' &&
          event.hasOwnProperty('testData') &&
          (element.type === 'checkbox' || element.type === 'radio')
        ) {
          log = getCheckboxOrRadioClickedLine(event)
        } else if (event.type === 'input' && event.hasOwnProperty('testData')) {
          log = getInputLine(element, event)
        } else if (event instanceof window.KeyboardEvent) {
          log = getKeyboardEventLine(event)
        } else if (event instanceof window.MouseEvent) {
          log = getMouseEventLine(event)
        }

        return [
          log,
          event.testData && event.testData.next.bubbledFrom
            ? `(bubbled from ${event.testData.next.bubbledFrom})`
            : null,
          modifiers,
        ]
          .filter(Boolean)
          .join(' ')
          .trim()
      })
      .join('\n')
      .trim()
    if (eventCalls.length) {
      return [
        `Events fired on: ${getElementDisplayName(element)}`,
        eventCalls,
      ].join('\n\n')
    } else {
      return `No events were fired on: ${getElementDisplayName(element)}`
    }
  }
  const clearEventCalls = () => generalListener.mockClear()
  const getEvents = () => generalListener.mock.calls.map(([e]) => e)
  const eventWasFired = eventType => getEvents().some(e => e.type === eventType)
  return {getEventCalls, clearEventCalls, getEvents, eventWasFired}
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const mouseButtonMap = {
  0: 'Left',
  1: 'Middle',
  2: 'Right',
  3: 'Browser Back',
  4: 'Browser Forward',
}
function getMouseEventLine(event) {
  return [`${event.type}:`, mouseButtonMap[event.button], `(${event.button})`]
    .join(' ')
    .trim()
}

function getKeyboardEventLine(event) {
  return [
    `${event.type}:`,
    event.key,
    typeof event.keyCode === 'undefined' ? null : `(${event.keyCode})`,
  ]
    .join(' ')
    .trim()
}

function getCheckboxOrRadioClickedLine(event) {
  const {previous, next} = event.testData

  return `${event.type}: ${previous.checked ? '' : 'un'}checked -> ${
    next.checked ? '' : 'un'
  }checked`
}

function getInputLine(element, event) {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    const {previous, next} = event.testData

    if (element.type === 'checkbox' || element.type === 'radio') {
      return `${event.type}: ${next.checked ? '' : 'un'}checked`
    } else {
      const prevVal = [
        previous.value.slice(0, previous.selectionStart),
        ...(previous.selectionStart === previous.selectionEnd
          ? ['{CURSOR}']
          : [
              '{SELECTION}',
              previous.value.slice(
                previous.selectionStart,
                previous.selectionEnd,
              ),
              '{/SELECTION}',
            ]),
        previous.value.slice(previous.selectionEnd),
      ].join('')
      return `${event.type}: "${prevVal}" -> "${next.value}"`
    }
  } else {
    throw new Error(
      `fired ${event.type} event on a ${element.tagName} which probably doesn't make sense. Fix that, or handle it in the setup function`,
    )
  }
}

// eslint-disable-next-line jest/prefer-hooks-on-top
afterEach(() => {
  for (const {el, type, listener} of eventListeners) {
    el.removeEventListener(type, listener)
  }
  eventListeners = []
  document.body.innerHTML = ''
})

export {setup, setupSelect, addEventListener, addListeners}
