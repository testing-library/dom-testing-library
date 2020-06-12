import redent from 'redent'
import {eventMap} from '../../../event-map'

// this is pretty helpful:
// https://codesandbox.io/s/quizzical-worker-eo909

// all of the stuff below is complex magic that makes the simpler tests work
// sorrynotsorry...

const unstringSnapshotSerializer = {
  test: val => val && val.hasOwnProperty('snapshot'),
  print: val => val.snapshot,
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

const eventLabelGetters = {
  KeyboardEvent(event) {
    return [
      event.key,
      typeof event.keyCode === 'undefined' ? null : `(${event.keyCode})`,
    ]
      .join(' ')
      .trim()
  },
  MouseEvent(event) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
    const mouseButtonMap = {
      0: 'Left',
      1: 'Middle',
      2: 'Right',
      3: 'Browser Back',
      4: 'Browser Forward',
    }
    return `${mouseButtonMap[event.button]} (${event.button})`
  },
}

let eventListeners = []

// asside from the hijacked listener stuff here, it's also important to call
// this function rather than simply calling addEventListener yourself
// because it adds your listener to an eventListeners array which is cleaned
// up automatically which will help use avoid memory leaks.
function addEventListener(el, type, listener, options) {
  eventListeners.push({el, type, listener})
  el.addEventListener(type, listener, options)
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
  const eventHandlerCalls = {current: []}
  const generalListener = jest
    .fn(event => {
      const callData = {
        event,
        elementDisplayName: getElementDisplayName(event.target),
      }
      if (element.testData && !element.testData.handled) {
        callData.testData = element.testData
        // sometimes firing a single event (like click on a checkbox) will
        // automatically fire more events (line input and change).
        // and we don't want the test data applied to those, so we'll store
        // this and not add the testData to our call if that was already handled
        element.testData.handled = true
      }
      eventHandlerCalls.current.push(callData)
    })
    .mockName('eventListener')
  const listeners = Object.keys(eventMap)

  for (const name of listeners) {
    addEventListener(element, name.toLowerCase(), (...args) => {
      const handler = eventHandlers[name]
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

  function getEventSnapshot() {
    const eventCalls = eventHandlerCalls.current
      .map(({event, testData, elementDisplayName}) => {
        const eventLabel =
          eventLabelGetters[event.constructor.name]?.(event) ?? ''
        const modifiers = ['altKey', 'shiftKey', 'metaKey', 'ctrlKey']
          .filter(key => event[key])
          .map(k => `{${k.replace('Key', '')}}`)
          .join('')

        const firstLine = [
          `${elementDisplayName} - ${event.type}`,
          [eventLabel, modifiers].filter(Boolean).join(' '),
        ]
          .filter(Boolean)
          .join(': ')

        return [
          firstLine,
          testData?.before ? redent(getChanges(testData), 2) : null,
        ]
          .filter(Boolean)
          .join('\n')
      })
      .join('\n')
      .trim()
    if (eventCalls.length) {
      return {
        snapshot: [
          `Events fired on: ${getElementDisplayName(element)}`,
          eventCalls,
        ].join('\n\n'),
      }
    } else {
      return {
        snapshot: `No events were fired on: ${getElementDisplayName(element)}`,
      }
    }
  }
  const clearEventCalls = () => {
    generalListener.mockClear()
    eventHandlerCalls.current = []
  }
  const getEvents = () => generalListener.mock.calls.map(([e]) => e)
  const eventWasFired = eventType => getEvents().some(e => e.type === eventType)

  function getClickEventsSnapshot() {
    const lines = getEvents().map(
      ({constructor, type, button, buttons, detail}) =>
        constructor.name === 'MouseEvent'
          ? `${type} - button=${button}; buttons=${buttons}; detail=${detail}`
          : type,
    )
    return {snapshot: lines.join('\n')}
  }

  return {
    getEventSnapshot,
    getClickEventsSnapshot,
    clearEventCalls,
    getEvents,
    eventWasFired,
  }
}

function getValueWithSelection({value, selectionStart, selectionEnd}) {
  return [
    value.slice(0, selectionStart),
    ...(selectionStart === selectionEnd
      ? ['{CURSOR}']
      : [
          '{SELECTION}',
          value.slice(selectionStart, selectionEnd),
          '{/SELECTION}',
        ]),
    value.slice(selectionEnd),
  ].join('')
}

const changeLabelGetter = {
  value: ({before, after}) =>
    [
      JSON.stringify(getValueWithSelection(before)),
      JSON.stringify(getValueWithSelection(after)),
    ].join(' -> '),
  checked: ({before, after}) =>
    [
      before.checked ? 'checked' : 'unchecked',
      after.checked ? 'checked' : 'unchecked',
    ].join(' -> '),
}
changeLabelGetter.selectionStart = changeLabelGetter.value
changeLabelGetter.selectionEnd = changeLabelGetter.value
const getDefaultLabel = ({key, before, after}) =>
  `${key}: ${JSON.stringify(before[key])} -> ${JSON.stringify(after[key])}`

function getChanges({before, after}) {
  const changes = new Set()
  for (const key of Object.keys(before)) {
    if (after[key] !== before[key]) {
      changes.add(
        (changeLabelGetter[key] ?? getDefaultLabel)({key, before, after}),
      )
    }
  }

  return Array.from(changes).join('\n')
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
