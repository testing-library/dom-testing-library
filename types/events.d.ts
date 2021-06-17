export type EventType =
  | 'abort'
  | 'animationEnd'
  | 'animationIteration'
  | 'animationStart'
  | 'blur'
  | 'canPlay'
  | 'canPlayThrough'
  | 'change'
  | 'click'
  | 'compositionEnd'
  | 'compositionStart'
  | 'compositionUpdate'
  | 'contextMenu'
  | 'copy'
  | 'cut'
  | 'dblClick'
  | 'doubleClick'
  | 'drag'
  | 'dragEnd'
  | 'dragEnter'
  | 'dragExit'
  | 'dragLeave'
  | 'dragOver'
  | 'dragStart'
  | 'drop'
  | 'durationChange'
  | 'emptied'
  | 'encrypted'
  | 'ended'
  | 'error'
  | 'focus'
  | 'focusIn'
  | 'focusOut'
  | 'gotPointerCapture'
  | 'input'
  | 'invalid'
  | 'keyDown'
  | 'keyPress'
  | 'keyUp'
  | 'load'
  | 'loadedData'
  | 'loadedMetadata'
  | 'loadStart'
  | 'lostPointerCapture'
  | 'mouseDown'
  | 'mouseEnter'
  | 'mouseLeave'
  | 'mouseMove'
  | 'mouseOut'
  | 'mouseOver'
  | 'mouseUp'
  | 'paste'
  | 'pause'
  | 'play'
  | 'playing'
  | 'pointerCancel'
  | 'pointerDown'
  | 'pointerEnter'
  | 'pointerLeave'
  | 'pointerMove'
  | 'pointerOut'
  | 'pointerOver'
  | 'pointerUp'
  | 'popState'
  | 'progress'
  | 'rateChange'
  | 'reset'
  | 'scroll'
  | 'seeked'
  | 'seeking'
  | 'select'
  | 'stalled'
  | 'submit'
  | 'suspend'
  | 'timeUpdate'
  | 'touchCancel'
  | 'touchEnd'
  | 'touchMove'
  | 'touchStart'
  | 'transitionEnd'
  | 'volumeChange'
  | 'waiting'
  | 'wheel'

export type FireFunction = (
  element: Document | Element | Node | Window,
  event: Event,
) => boolean
export type FireObject = {
  [K in EventType]: (
    element: Document | Element | Node | Window,
    options?: {},
  ) => boolean
}
export type CreateFunction = (
  eventName: string,
  node: Document | Element | Node | Window,
  init?: {},
  options?: {EventType?: string; defaultInit?: {}},
) => Event
export type CreateObject = {
  [K in EventType]: (
    element: Document | Element | Node | Window,
    options?: {},
  ) => Event
}

export const createEvent: CreateFunction & CreateObject
export const fireEvent: FireFunction & FireObject
