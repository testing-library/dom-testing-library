import {fireEvent} from '..'

const eventTypes = [
  {
    type: 'Clipboard',
    events: ['copy', 'paste'],
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
    type: 'Image',
    events: ['load', 'error'],
    elementType: 'img',
  },
  {
    type: 'Animation',
    events: ['animationStart', 'animationEnd', 'animationIteration'],
    elementType: 'div',
  },
  {
    type: 'Transition',
    events: ['transitionEnd'],
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

const bubblingEvents = [
  {name: 'copy', bubbles: true},
  {name: 'cut', bubbles: true},
  {name: 'paste', bubbles: true},
  {name: 'compositionEnd', bubbles: true},
  {name: 'compositionStart', bubbles: true},
  {name: 'compositionUpdate', bubbles: true},
  {name: 'keyDown', bubbles: true},
  {name: 'keyPress', bubbles: true},
  {name: 'keyUp', bubbles: true},
  {name: 'focus', bubbles: false},
  {name: 'blur', bubbles: false},
  {name: 'focusIn', bubbles: true},
  {name: 'focusOut', bubbles: true},
  {name: 'change', bubbles: true},
  {name: 'input', bubbles: true},
  {name: 'invalid', bubbles: false},
  {name: 'submit', bubbles: true},
  {name: 'reset', bubbles: true},
  {name: 'click', bubbles: true},
  {name: 'contextMenu', bubbles: true},
  {name: 'dblClick', bubbles: true},
  {name: 'drag', bubbles: true},
  {name: 'dragEnd', bubbles: true},
  {name: 'dragEnter', bubbles: true},
  {name: 'dragExit', bubbles: true},
  {name: 'dragLeave', bubbles: true},
  {name: 'dragOver', bubbles: true},
  {name: 'dragStart', bubbles: true},
  {name: 'drop', bubbles: true},
  {name: 'mouseDown', bubbles: true},
  {name: 'mouseEnter', bubbles: false},
  {name: 'mouseLeave', bubbles: false},
  {name: 'mouseMove', bubbles: true},
  {name: 'mouseOut', bubbles: true},
  {name: 'mouseOver', bubbles: true},
  {name: 'mouseUp', bubbles: true},
  {name: 'select', bubbles: true},
  {name: 'touchCancel', bubbles: true},
  {name: 'touchEnd', bubbles: true},
  {name: 'touchMove', bubbles: true},
  {name: 'touchStart', bubbles: true},
  {name: 'scroll', bubbles: false},
  {name: 'wheel', bubbles: true},
  {name: 'abort', bubbles: false},
  {name: 'canPlay', bubbles: false},
  {name: 'canPlayThrough', bubbles: false},
  {name: 'durationChange', bubbles: false},
  {name: 'emptied', bubbles: false},
  {name: 'encrypted', bubbles: false},
  {name: 'ended', bubbles: false},
  {name: 'loadedData', bubbles: false},
  {name: 'loadedMetadata', bubbles: false},
  {name: 'loadStart', bubbles: false},
  {name: 'pause', bubbles: false},
  {name: 'play', bubbles: false},
  {name: 'playing', bubbles: false},
  {name: 'progress', bubbles: false},
  {name: 'rateChange', bubbles: false},
  {name: 'seeked', bubbles: false},
  {name: 'seeking', bubbles: false},
  {name: 'stalled', bubbles: false},
  {name: 'suspend', bubbles: false},
  {name: 'timeUpdate', bubbles: false},
  {name: 'volumeChange', bubbles: false},
  {name: 'waiting', bubbles: false},
  {name: 'load', bubbles: false},
  {name: 'error', bubbles: false},
  {name: 'animationStart', bubbles: true},
  {name: 'animationEnd', bubbles: true},
  {name: 'animationIteration', bubbles: true},
  {name: 'transitionEnd', bubbles: true},
  {name: 'pointerOver', bubbles: true},
  {name: 'pointerEnter', bubbles: false},
  {name: 'pointerDown', bubbles: true},
  {name: 'pointerMove', bubbles: true},
  {name: 'pointerUp', bubbles: true},
  {name: 'pointerCancel', bubbles: true},
  {name: 'pointerOut', bubbles: true},
  {name: 'pointerLeave', bubbles: false},
  {name: 'gotPointerCapture', bubbles: false},
  {name: 'lostPointerCapture', bubbles: false},
]

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

describe(`Bubbling Events`, () => {
  bubblingEvents
    .filter(e => e.bubbles)
    .forEach(event =>
      it(`bubbles ${event.name}`, () => {
        const node = document.createElement('div')
        const spy = jest.fn()
        node.addEventListener(event.name.toLowerCase(), spy)

        const innerNode = document.createElement('div')
        node.appendChild(innerNode)

        fireEvent[event.name](innerNode)
        expect(spy).toHaveBeenCalledTimes(1)
      }),
    )

  bubblingEvents
    .filter(e => !e.bubbles)
    .forEach(event =>
      it(`doesn't bubble ${event.name}`, () => {
        const node = document.createElement('div')
        const spy = jest.fn()
        node.addEventListener(event.name.toLowerCase(), spy)

        const innerNode = document.createElement('div')
        node.appendChild(innerNode)

        fireEvent[event.name](innerNode)
        expect(spy).not.toHaveBeenCalled()
      }),
    )
})

describe(`Aliased Events`, () => {
  it(`fires doubleClick`, () => {
    const node = document.createElement('div')
    const spy = jest.fn()
    node.addEventListener('dblclick', spy)
    fireEvent.doubleClick(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

test('assigns target properties', () => {
  const node = document.createElement('input')
  const spy = jest.fn()
  const value = 'a'
  node.addEventListener('change', spy)
  fireEvent.change(node, {target: {value}})
  expect(spy).toHaveBeenCalledTimes(1)
  expect(node.value).toBe(value)
})

test('assigns selection-related target properties', () => {
  const node = document.createElement('input')
  const spy = jest.fn()
  const value = 'ab'
  const selectionStart = 1
  const selectionEnd = 2
  node.addEventListener('change', spy)
  fireEvent.change(node, {target: {value, selectionStart, selectionEnd}})
  expect(node.value).toBe(value)
  expect(node.selectionStart).toBe(selectionStart)
  expect(node.selectionEnd).toBe(selectionEnd)
})

test('assigning a value to a target that cannot have a value throws an error', () => {
  const node = document.createElement('div')
  expect(() =>
    fireEvent.change(node, {target: {value: 'a'}}),
  ).toThrowErrorMatchingInlineSnapshot(
    `"The given element does not have a value setter"`,
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

test('fires events on Window', () => {
  const messageSpy = jest.fn()
  window.addEventListener('message', messageSpy)
  fireEvent(window, new window.MessageEvent('message', {data: 'hello'}))
  expect(messageSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('message', messageSpy)
})

test('fires shortcut events on Window', () => {
  const clickSpy = jest.fn()
  window.addEventListener('click', clickSpy)
  fireEvent.click(window)
  expect(clickSpy).toHaveBeenCalledTimes(1)
  window.removeEventListener('message', clickSpy)
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
