// fallback to Event
const AnimationEvent = global.AnimationEvent || Event
const ClipboardEvent = global.ClipboardEvent || Event
const CompositionEvent = global.CompositionEvent || Event
const DragEvent = global.DragEvent || Event
const FocusEvent = global.FocusEvent || Event
const InputEvent = global.InputEvent || Event
const KeyboardEvent = global.KeyboardEvent || Event
const MouseEvent = global.MouseEvent || Event
const ProgressEvent = global.ProgressEvent || Event
const TouchEvent = global.TouchEvent || Event
const TransitionEvent = global.TransitionEvent || Event
const UIEvent = global.UIEvent || Event
const WheelEvent = global.WheelEvent || Event

/**
 * Include convenience methods for all events supported in React.
 * https://reactjs.org/docs/events.html#supported-events
 */
const eventMap = {
  // https://reactjs.org/docs/events.html#clipboard-events
  copy: {
    EventType: CompositionEvent,
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
  // https://reactjs.org/docs/events.html#composition-events
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
  // https://reactjs.org/docs/events.html#keyboard-events
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
  // https://reactjs.org/docs/events.html#focus-events
  focus: {
    EventType: FocusEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  blur: {
    EventType: FocusEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // https://reactjs.org/docs/events.html#form-events
  change: {
    EventType: InputEvent,
    defaultInit: {bubbles: true, cancelable: true},
    before(node) {
      // input event will trigger onChange for React
      fireEvent.input(node)
    },
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
  // https://reactjs.org/docs/events.html#mouse-events
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
    after(node) {
      // mouseover event will trigger onMouseEnter for React
      fireEvent.mouseOver(node)
    },
  },
  mouseLeave: {
    EventType: MouseEvent,
    defaultInit: {bubbles: true, cancelable: true},
    after(node) {
      // mouseout event will trigger onMouseLeave for React
      fireEvent.mouseOut(node)
    },
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
  // https://reactjs.org/docs/events.html#selection-events
  select: {
    EventType: Event,
    defaultInit: {bubbles: true, cancelable: false},
  },
  // https://reactjs.org/docs/events.html#touch-events
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
  // https://reactjs.org/docs/events.html#ui-events
  scroll: {
    EventType: UIEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // https://reactjs.org/docs/events.html#wheel-events
  wheel: {
    EventType: WheelEvent,
    defaultInit: {bubbles: true, cancelable: true},
  },
  // https://reactjs.org/docs/events.html#media-events
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
  // https://reactjs.org/docs/events.html#image-events
  load: {
    EventType: UIEvent,
    defaultInit: {bubbles: false, cancelable: false},
  },
  error: {
    EventType: Event,
    defaultInit: {bubbles: false, cancelable: false},
  },
  // https://reactjs.org/docs/events.html#animation-events
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
  // https://reactjs.org/docs/events.html#transition-events
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

Object.entries(eventMap).forEach(
  ([key, {EventType, defaultInit, before, after}]) => {
    const eventName = key.toLowerCase()

    fireEvent[key] = (node, init) => {
      const eventInit = Object.assign({}, defaultInit, init)
      const event = new EventType(eventName, eventInit)
      if (before) before(node, event)
      const ret = fireEvent(node, event)
      if (after) after(node, event)
      return ret
    }
  },
)

Object.entries(eventAliasMap).forEach(([aliasKey, key]) => {
  fireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

export {fireEvent}
