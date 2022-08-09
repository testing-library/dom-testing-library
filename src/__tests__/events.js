import {eventMap, eventAliasMap} from '../event-map'
import {fireEvent, createEvent} from '..'

const eventTypes = [
  {
    type: 'Clipboard',
    events: ['copy', 'cut', 'paste'],
    elementType: 'input',
  },
  {
    type: 'Composition',
    events: ['compositionEnd', 'compositionStart', 'compositionUpdate'],
    elementType: 'input',
  },
  {
    type: 'Keyboard',
    events: ['keyDown', 'keyPress', 'keyUp'],
    elementType: 'input',
  },
  {
    type: 'Focus',
    events: ['focus', 'blur', 'focusIn', 'focusOut'],
    elementType: 'input',
  },
  {
    type: 'Input',
    events: ['change', 'input', 'invalid'],
    elementType: 'input',
  },
  {
    type: 'Form',
    events: ['submit', 'reset'],
    elementType: 'form',
  },
  {
    type: 'Mouse',
    events: [
      'click',
      'contextMenu',
      'dblClick',
      'drag',
      'dragEnd',
      'dragEnter',
      'dragExit',
      'dragLeave',
      'dragOver',
      'dragStart',
      'drop',
      'mouseDown',
      'mouseEnter',
      'mouseLeave',
      'mouseMove',
      'mouseOut',
      'mouseOver',
      'mouseUp',
    ],
    elementType: 'button',
  },
  {
    type: 'Selection',
    events: ['select'],
    elementType: 'input',
  },
  {
    type: 'Touch',
    events: ['touchCancel', 'touchEnd', 'touchMove', 'touchStart'],
    elementType: 'button',
  },
  {
    type: 'UI',
    events: ['scroll'],
    elementType: 'div',
  },
  {
    type: '',
    events: ['load', 'error'],
    elementType: 'img',
  },
  {
    type: '',
    events: ['load', 'error'],
    elementType: 'script',
  },
  {
    type: 'Wheel',
    events: ['wheel'],
    elementType: 'div',
  },
  {
    type: 'Media',
    events: [
      'abort',
      'canPlay',
      'canPlayThrough',
      'durationChange',
      'emptied',
      'encrypted',
      'ended',
      'error',
      'loadedData',
      'loadedMetadata',
      'loadStart',
      'pause',
      'play',
      'playing',
      'progress',
      'rateChange',
      'seeked',
      'seeking',
      'stalled',
      'suspend',
      'timeUpdate',
      'volumeChange',
      'waiting',
    ],
    elementType: 'video',
  },
  {
    type: 'Animation',
    events: ['animationStart', 'animationEnd', 'animationIteration'],
    elementType: 'div',
  },
  {
    type: 'Transition',
    events: [
      'transitionCancel',
      'transitionEnd',
      'transitionRun',
      'transitionStart',
    ],
    elementType: 'div',
  },
  {
    type: 'Pointer',
    events: [
      'pointerOver',
      'pointerEnter',
      'pointerDown',
      'pointerMove',
      'pointerUp',
      'pointerCancel',
      'pointerOut',
      'pointerLeave',
      'gotPointerCapture',
      'lostPointerCapture',
    ],
    elementType: 'div',
  },
]

const allEvents = Object.keys(eventMap)

const bubblingEvents = allEvents.filter(
  eventName => eventMap[eventName].defaultInit.bubbles,
)

const composedEvents = allEvents.filter(
  eventName => eventMap[eventName].defaultInit.composed,
)

const nonBubblingEvents = allEvents.filter(
  eventName => !bubblingEvents.includes(eventName),
)

const nonComposedEvents = allEvents.filter(
  eventName => !composedEvents.includes(eventName),
)

eventTypes.forEach(({type, events, elementType}) => {
  describe(`${type} Events`, () => {
    events.forEach(eventName => {
      it(`fires ${eventName}`, () => {
        const node = document.createElement(elementType)
        const spy = jest.fn()
        node.addEventListener(eventName.toLowerCase(), spy)
        fireEvent[eventName](node)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })
  })
})

it('fires resize', () => {
  const node = document.defaultView
  const spy = jest.fn()
  node.addEventListener('resize', spy, {once: true})
  fireEvent.resize(node)
  expect(spy).toHaveBeenCalledTimes(1)
})

describe(`Bubbling Events`, () => {
  bubblingEvents.forEach(event =>
    it(`bubbles ${event}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(event.toLowerCase(), spy)

      const innerNode = document.createElement('div')
      node.appendChild(innerNode)

      fireEvent[event](innerNode)
      expect(spy).toHaveBeenCalledTimes(1)
    }),
  )

  nonBubblingEvents.forEach(event =>
    it(`doesn't bubble ${event}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(event.toLowerCase(), spy)

      const innerNode = document.createElement('div')
      node.appendChild(innerNode)

      fireEvent[event](innerNode)
      expect(spy).not.toHaveBeenCalled()
    }),
  )
})

describe(`Composed Events`, () => {
  composedEvents.forEach(event =>
    it(`${event} crosses shadow DOM boundary`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(event.toLowerCase(), spy)

      const shadowRoot = node.attachShadow({mode: 'closed'})
      const innerNode = document.createElement('div')
      shadowRoot.appendChild(innerNode)

      fireEvent[event](innerNode)
      expect(spy).toHaveBeenCalledTimes(1)
    }),
  )

  nonComposedEvents.forEach(event =>
    it(`${event} does not cross shadow DOM boundary`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(event.toLowerCase(), spy)

      const shadowRoot = node.attachShadow({mode: 'closed'})
      const innerNode = document.createElement('div')
      shadowRoot.appendChild(innerNode)

      fireEvent[event](innerNode)
      expect(spy).not.toHaveBeenCalled()
    }),
  )
})

describe(`Aliased Events`, () => {
  Object.keys(eventAliasMap).forEach(eventAlias => {
    it(`fires ${eventAlias}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(eventAliasMap[eventAlias].toLowerCase(), spy)

      fireEvent[eventAlias](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

test('assigns target properties', () => {
  const node = document.createElement('input')
  const spy = jest.fn()
  const value = 'a'
  node.addEventListener('change', spy)
  fireEvent.change(node, {target: {value}})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(node).toHaveValue(value)
})

test('assigns selection-related target properties', () => {
  const node = document.createElement('input')
  const spy = jest.fn()
  const value = 'ab'
  const selectionStart = 1
  const selectionEnd = 2
  node.addEventListener('change', spy)
  fireEvent.change(node, {target: {value, selectionStart, selectionEnd}})
  expect(node).toHaveValue(value)
  expect(node.selectionStart).toBe(selectionStart)
  expect(node.selectionEnd).toBe(selectionEnd)
})

test('assigning a value to a target that cannot have a value throws an error', () => {
  const node = document.createElement('div')
  expect(() =>
    fireEvent.change(node, {target: {value: 'a'}}),
  ).toThrowErrorMatchingInlineSnapshot(
    `The given element does not have a value setter`,
  )
})

test('assigning the files property on an input', () => {
  const node = document.createElement('input')
  const file = new document.defaultView.File(['(⌐□_□)'], 'chucknorris.png', {
    type: 'image/png',
  })
  fireEvent.change(node, {target: {files: [file]}})
  expect(node.files).toEqual([file])
})

test('assigns dataTransfer properties', () => {
  const node = document.createElement('div')
  const spy = jest.fn()
  node.addEventListener('dragover', spy)
  fireEvent.dragOver(node, {dataTransfer: {dropEffect: 'move'}})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy.mock.calls[0][0]).toHaveProperty('dataTransfer.dropEffect', 'move')
})

test('assigns dataTransfer non-enumerable properties', () => {
  window.DataTransfer = function DataTransfer() {}
  const node = document.createElement('div')
  const spy = jest.fn()
  const item = {}
  const dataTransfer = new window.DataTransfer()

  Object.defineProperty(dataTransfer, 'items', {
    value: [item],
    enumerable: false,
  })
  node.addEventListener('drop', spy)
  fireEvent.drop(node, {dataTransfer})

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy.mock.calls[0][0].dataTransfer.items).toHaveLength(1)

  delete window.DataTransfer
})

test('assigning the files property on dataTransfer', () => {
  const node = document.createElement('div')
  const file = new document.defaultView.File(['(⌐□_□)'], 'chucknorris.png', {
    type: 'image/png',
  })
  const spy = jest.fn()
  node.addEventListener('drop', spy)
  fireEvent.drop(node, {dataTransfer: {files: [file]}})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy.mock.calls[0][0]).toHaveProperty('dataTransfer.files', [file])
})

test('assigns clipboardData properties', () => {
  const node = document.createElement('div')
  const spy = jest.fn()
  node.addEventListener('paste', spy)
  const clipboardData = {
    dropEffect: 'none',
    effectAllowed: 'uninitialized',
    files: [],
    items: [
      {
        kind: 'string',
        type: 'text/plain',
        file: {
          getAsFile() {
            return null
          },
        },
      },
    ],
    types: ['text/plain'],
    getData() {
      return 'example'
    },
  }
  fireEvent.paste(node, {clipboardData})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy.mock.calls[0][0].clipboardData).toBe(clipboardData)
  expect(clipboardData.items[0].file.getAsFile()).toBeNull()
  expect(clipboardData.getData('text')).toBe('example')
})

test('fires events on Window', () => {
  const messageSpy = jest.fn()
  window.addEventListener('message', messageSpy)
  fireEvent(window, new window.MessageEvent('message', {data: 'hello'}))
  expect(messageSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('message', messageSpy)
})

test('fires history popstate event on Window', () => {
  const popStateSpy = jest.fn()
  window.addEventListener('popstate', popStateSpy)
  fireEvent.popState(window, {
    location: 'http://www.example.com/?page=1',
    state: {page: 1},
  })
  expect(popStateSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('popstate', popStateSpy)
})

test('fires shortcut events on Window', () => {
  const clickSpy = jest.fn()
  window.addEventListener('click', clickSpy)
  fireEvent.click(window)
  expect(clickSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('click', clickSpy)
})

test('throws a useful error message when firing events on non-existent nodes', () => {
  expect(() => fireEvent(undefined, new MouseEvent('click'))).toThrow(
    'Unable to fire a "click" event - please provide a DOM element.',
  )
})

test('throws a useful error message when firing events on non-existent nodes (shortcut)', () => {
  expect(() => fireEvent.click(undefined)).toThrow(
    'Unable to fire a "click" event - please provide a DOM element.',
  )
})

test('throws a useful error message when firing non-events', () => {
  expect(() => fireEvent(document.createElement('div'), undefined)).toThrow(
    'Unable to fire an event - please provide an event object.',
  )
})

test('fires events on Document', () => {
  const keyDownSpy = jest.fn()
  document.addEventListener('keydown', keyDownSpy)
  fireEvent.keyDown(document, {key: 'Escape'})
  expect(keyDownSpy).toHaveBeenCalledTimes(1)
  document.removeEventListener('keydown', keyDownSpy)
})

test('can create generic events', () => {
  const el = document.createElement('div')
  const eventName = 'my-custom-event'
  const handler = jest.fn()
  el.addEventListener(eventName, handler)
  const event = createEvent(eventName, el)
  fireEvent(el, event)
  expect(handler).toHaveBeenCalledTimes(1)
  expect(handler).toHaveBeenCalledWith(event)
})
