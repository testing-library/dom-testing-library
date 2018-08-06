const {
  AnimationEvent,
  ClipboardEvent,
  CompositionEvent,
  DragEvent,
  Event,
  FocusEvent,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  ProgressEvent,
  TouchEvent,
  TransitionEvent,
  UIEvent,
  WheelEvent,
} =
  typeof window === 'undefined' ? /* istanbul ignore next */ global : window

const eventMap = {
  // Clipboard Events
  copy: {
    EventType: ClipboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  cut: {
    EventType: ClipboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  paste: {
    EventType: ClipboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Composition Events
  compositionEnd: {
    EventType: CompositionEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  compositionStart: {
    EventType: CompositionEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  compositionUpdate: {
    EventType: CompositionEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Keyboard Events
  keyDown: {
    EventType: KeyboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  keyPress: {
    EventType: KeyboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  keyUp: {
    EventType: KeyboardEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Focus Events
  focus: {
    EventType: FocusEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  blur: {
    EventType: FocusEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Form Events
  change: {
    EventType: InputEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  input: {
    EventType: InputEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  invalid: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: true},
  },
  submit: {
    EventType: Event,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Mouse Events
  click: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true, button: 0},
  },
  contextMenu: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  dblClick: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  drag: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragEnd: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragEnter: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragExit: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragLeave: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  dragOver: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  dragStart: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  drop: {
    EventType: DragEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseDown: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseEnter: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseLeave: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseMove: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseOut: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseOver: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  mouseUp: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Selection Events
  select: {
    EventType: Event,
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Touch Events
  touchCancel: {
    EventType: TouchEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  touchEnd: {
    EventType: TouchEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  touchMove: {
    EventType: TouchEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  touchStart: {
    EventType: TouchEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // UI Events
  scroll: {
    EventType: UIEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Wheel Events
  wheel: {
    EventType: WheelEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // Media Events
  abort: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  canPlay: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  canPlayThrough: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  durationChange: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  emptied: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  encrypted: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  ended: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // error: {
  //   EventType: Event,
  //   defaultInit: {bubbles: false, cancelable: false},
  // },
  loadedData: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  loadedMetadata: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  loadStart: {
    EventType: ProgressEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  pause: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  play: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  playing: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  progress: {
    EventType: ProgressEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  rateChange: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  seeked: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  seeking: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  stalled: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  suspend: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  timeUpdate: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  volumeChange: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  waiting: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Image Events
  load: {
    EventType: UIEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  error: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // Animation Events
  animationStart: {
    EventType: AnimationEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  animationEnd: {
    EventType: AnimationEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  animationIteration: {
    EventType: AnimationEvent,
    defaultInit: {bubbles: true, cancelable: false},
  },
  // Transition Events
  transitionEnd: {
    EventType: TransitionEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
}

const eventAliasMap = {
  doubleClick: 'dblClick',
}

function fireEvent(element, event) {
  return element.dispatchEvent(event)
}

Object.entries(eventMap).forEach(([key, {EventType = Event, defaultInit}]) => {
  const eventName = key.toLowerCase()

  fireEvent[key] = (node, init) => {
    const eventInit = {...defaultInit, ...init}
    const {target: {value, ...targetProperties} = {}} = eventInit
    Object.assign(node, targetProperties)
    if (value !== undefined) {
      setNativeValue(node, value)
    }
    const event = new EventType(eventName, eventInit)
    return fireEvent(node, event)
  }
})

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

Object.entries(eventAliasMap).forEach(([aliasKey, key]) => {
  fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

export {fireEvent}

/* eslint complexity:["error", 9] */
