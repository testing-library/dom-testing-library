import {eventAliasMap, eventMap} from '../src/event-map'

export type EventType = keyof (typeof eventMap & typeof eventAliasMap)

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
