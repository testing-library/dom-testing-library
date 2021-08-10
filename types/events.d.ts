export type EventType =
  | 'copy'
  | 'cut'
  | 'paste'
export type EventMapValue<EVTNAME extends EventType> =
  typeof eventMap[EVTNAME extends keyof typeof eventMap
    ? EVTNAME
    : EVTNAME extends keyof typeof eventAliasMap
    ? typeof eventAliasMap[EVTNAME]
    : never]
export type EventMapValueEvent<EVTNAME extends EventType> =
  typeof window[EventMapValue<EVTNAME>['EventType']]['prototype']


export type FakeEventTarget<ignoredE extends HTMLElement> =
  Partial<HTMLInputElement>
  | 'invalid'
  | 'submit'
  | 'reset'
  | 'click'
  | 'contextMenu'
  | 'dblClick'
  | 'drag'
  | 'dragEnd'
  | 'dragEnter'
  | 'dragExit'
  | 'dragLeave'
  | 'dragOver'
  | 'dragStart'
  | 'drop'
  | 'mouseDown'
  | 'mouseEnter'
  | 'mouseLeave'
  | 'mouseMove'
  | 'mouseOut'
  | 'mouseOver'
  | 'mouseUp'
  | 'popState'
  | 'select'
  | 'touchCancel'
  | 'touchEnd'
  | 'touchMove'
  | 'touchStart'
  | 'resize'
  | 'scroll'
  | 'wheel'
  | 'abort'
  | 'canPlay'
  | 'canPlayThrough'
  | 'durationChange'
  | 'emptied'
  | 'encrypted'
  | 'ended'
  | 'loadedData'
  | 'loadedMetadata'
  | 'loadStart'
  | 'pause'
  | 'play'
  | 'playing'
  | 'progress'
  | 'rateChange'
  | 'seeked'
  | 'seeking'
  | 'stalled'
  | 'suspend'
  | 'timeUpdate'
  | 'volumeChange'
  | 'waiting'
  | 'load'
  | 'error'
  | 'animationStart'
  | 'animationEnd'
  | 'animationIteration'
  | 'transitionEnd'
  | 'doubleClick'
  | 'pointerOver'
  | 'pointerEnter'
  | 'pointerDown'
  | 'pointerMove'
  | 'pointerUp'
  | 'pointerCancel'
  | 'pointerOut'
  | 'pointerLeave'
  | 'gotPointerCapture'
  | 'lostPointerCapture'

export type FireFunction = (element: HTMLElement, event?: Event) => boolean
export type FireObject = {
  [K in EventType]: <E extends HTMLElement>(
    element: E,
    init?: CreateFunctionInit,
  ) => boolean
}
export type CreateFunctionInit<
  EVTNAME extends EventType = EventType,
  N extends HTMLElement = HTMLElement,
> = Partial<EventMapValueEvent<EVTNAME>> & {
  target?: FakeEventTarget<N>
  detail: number | undefined
}
export type CreateFunction<
  EVTNAME extends EventType = EventType,
  N extends HTMLElement = HTMLElement,
> = (
  eventName: EVTNAME,
  node?: N,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init?: CreateFunctionInit<EVTNAME, N>,
  options?: {
    EventType?: EventMapValue<EVTNAME>['EventType']
    defaultInit?: EventMapValue<EVTNAME>['defaultInit'] | {}
  },
) => Event
export type CreateObject = {
  [K in EventType]: <
    EVTNAME extends EventType = EventType,
    N extends HTMLElement = HTMLElement,
  >(
    node: N,
    eventProperties?: CreateFunctionInit<EVTNAME, N>,
  ) => EventMapValueEvent<EVTNAME>
}

export const createEvent: CreateObject & CreateFunction
export const fireEvent: FireFunction & FireObject
