const eventMap = {
  // Clipboard Events
  copy: {
    EventType: 'ClipboardEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  cut: {
    EventType: 'ClipboardEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  paste: {
    EventType: 'ClipboardEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Composition Events
  compositionEnd: {
    EventType: 'CompositionEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  compositionStart: {
    EventType: 'CompositionEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  compositionUpdate: {
    EventType: 'CompositionEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Keyboard Events
  keyDown: {
    EventType: 'KeyboardEvent',
    defaultInit: {bubbles: true, cancelable: true, charCode: 0},
  },
  keyPress: {
    EventType: 'KeyboardEvent',
    defaultInit: {bubbles: true, cancelable: true, charCode: 0},
  },
  keyUp: {
    EventType: 'KeyboardEvent',
    defaultInit: {bubbles: true, cancelable: true, charCode: 0},
  },
  // Focus Events
  focus: {
    EventType: 'FocusEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  blur: {
    EventType: 'FocusEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  focusIn: {
    EventType: 'FocusEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  focusOut: {
    EventType: 'FocusEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Form Events
  change: {
    EventType: 'Event',
    defaultInit: {bubbles: true, cancelable: false},
  },
  input: {
    EventType: 'InputEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  invalid: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: true},
  },
  submit: {
    EventType: 'Event',
    defaultInit: {bubbles: true, cancelable: true},
  },
  reset: {
    EventType: 'Event',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Mouse Events
  click: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true, button: 0},
  },
  contextMenu: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  dblClick: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  drag: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragEnd: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragEnter: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragExit: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragLeave: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragOver: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragStart: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  drop: {
    EventType: 'DragEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseDown: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseEnter: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  mouseLeave: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  mouseMove: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseOut: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseOver: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseUp: {
    EventType: 'MouseEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Selection Events
  select: {
    EventType: 'Event',
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Touch Events
  touchCancel: {
    EventType: 'TouchEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  touchEnd: {
    EventType: 'TouchEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  touchMove: {
    EventType: 'TouchEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  touchStart: {
    EventType: 'TouchEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // UI Events
  scroll: {
    EventType: 'UIEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Wheel Events
  wheel: {
    EventType: 'WheelEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Media Events
  abort: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  canPlay: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  canPlayThrough: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  durationChange: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  emptied: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  encrypted: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  ended: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  loadedData: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  loadedMetadata: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  loadStart: {
    EventType: 'ProgressEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  pause: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  play: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  playing: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  progress: {
    EventType: 'ProgressEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  rateChange: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  seeked: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  seeking: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  stalled: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  suspend: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  timeUpdate: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  volumeChange: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  waiting: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Image Events
  load: {
    EventType: 'UIEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  error: {
    EventType: 'Event',
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Animation Events
  animationStart: {
    EventType: 'AnimationEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  animationEnd: {
    EventType: 'AnimationEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  animationIteration: {
    EventType: 'AnimationEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Transition Events
  transitionEnd: {
    EventType: 'TransitionEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  // pointer events
  pointerOver: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  pointerEnter: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  pointerDown: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  pointerMove: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  pointerUp: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  pointerCancel: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
  pointerOut: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: true, cancelable: true},
  },
  pointerLeave: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  gotPointerCapture: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  lostPointerCapture: {
    EventType: 'PointerEvent',
    defaultInit: {bubbles: false, cancelable: false},
  },
  // history events
  popState: {
    EventType: 'PopStateEvent',
    defaultInit: {bubbles: true, cancelable: false},
  },
}

const eventAliasMap = {
  doubleClick: 'dblClick',
}

function fireEvent(element, event) {
  if (!event) {
    throw new Error(`Unable to fire an event - please provide an event object.`)
  }
  if (!element) {
    throw new Error(
      `Unable to fire a "${event.type}" event - please provide a DOM element.`,
    )
  }
  return element.dispatchEvent(event)
}

const createEvent = {}

Object.keys(eventMap).forEach(key => {
  const {EventType, defaultInit} = eventMap[key]
  const eventName = key.toLowerCase()

  createEvent[key] = (node, init) => {
    if (!node) {
      throw new Error(
        `Unable to fire a "${key}" event - please provide a DOM element.`,
      )
    }
    const eventInit = {...defaultInit, ...init}
    const {target: {value, files, ...targetProperties} = {}} = eventInit
    if (value !== undefined) {
      setNativeValue(node, value)
    }
    if (files !== undefined) {
      // input.files is a read-only property so this is not allowed:
      // input.files = [file]
      // so we have to use this workaround to set the property
      Object.defineProperty(node, 'files', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: files,
      })
    }
    Object.assign(node, targetProperties)
    const window = getWindowFromNode(node)
    const EventConstructor = window[EventType] || window.Event
    /* istanbul ignore else  */
    if (typeof EventConstructor === 'function') {
      return new EventConstructor(eventName, eventInit)
    } else {
      // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
      const event = window.document.createEvent(EventType)
      const {bubbles, cancelable, detail, ...otherInit} = eventInit
      event.initEvent(eventName, bubbles, cancelable, detail)
      Object.keys(otherInit).forEach(eventKey => {
        event[eventKey] = otherInit[eventKey]
      })
      return event
    }
  }

  fireEvent[key] = (node, init) => fireEvent(node, createEvent[key](node, init))
})

function getWindowFromNode(node) {
  // istanbul ignore next I'm not sure what could cause the final else so we'll leave it uncovered.
  if (node.defaultView) {
    // node is document
    return node.defaultView
  } else if (node.ownerDocument && node.ownerDocument.defaultView) {
    // node is a DOM node
    return node.ownerDocument.defaultView
  } else if (node.window) {
    // node is window
    return node.window
  } else {
    // no idea...
    throw new Error(
      `Unable to find the "window" object for the given node. fireEvent currently supports firing events on DOM nodes, document, and window. Please file an issue with the code that's causing you to see this error: https://github.com/testing-library/dom-testing-library/issues/new`,
    )
  }
}

// function written after some investigation here:
// https://github.com/facebook/react/issues/10135#issuecomment-401496776
function setNativeValue(element, value) {
  const {set: valueSetter} =
    Object.getOwnPropertyDescriptor(element, 'value') || {}
  const prototype = Object.getPrototypeOf(element)
  const {set: prototypeValueSetter} =
    Object.getOwnPropertyDescriptor(prototype, 'value') || {}
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value)
  } /* istanbul ignore next (I don't want to bother) */ else if (valueSetter) {
    valueSetter.call(element, value)
  } else {
    throw new Error('The given element does not have a value setter')
  }
}

Object.keys(eventAliasMap).forEach(aliasKey => {
  const key = eventAliasMap[aliasKey]
  fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

export {fireEvent, createEvent}

/* eslint complexity:["error", 9] */
