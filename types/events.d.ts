import {eventAliasMap, eventMap} from '../src/event-map'

export type EventType =
  | keyof typeof eventMap
  | keyof typeof eventAliasMap
  | 'customEvent'

export type EventMapValue<EVTNAME extends EventType> =
  EVTNAME extends keyof typeof eventMap
    ? typeof eventMap[EVTNAME]
    : EVTNAME extends keyof typeof eventAliasMap
    ? typeof eventMap[typeof eventAliasMap[EVTNAME]]
    : {
        EventType: 'Event'
        defaultInit: {
          bubbles?: boolean
          cancelable?: boolean
          composed?: boolean
        }
      }

export type EventMapValueEventClass<EVTNAME extends EventType> =
  typeof window[EventMapValue<EVTNAME>['EventType']]

export type EventMapValueEvent<EVTNAME extends EventType> =
  EventMapValueEventClass<EVTNAME>['prototype']

export type EventMapValueEventInit<EVTNAME extends EventType> =
  EventMapValueEventClass<EVTNAME> extends {
    new (arg0: string, arg1: infer initArg): EventMapValueEvent<EVTNAME>
  }
    ? NonNullable<initArg>
    : any

export type EventInitFromEventClass<E extends {new (...args: any[]): any}> =
  E extends {
    new (arg0: string, arg1?: infer initArg): Event
  }
    ? NonNullable<initArg>
    : any

export type AnyEventTarget = HTMLElement | Node | Window

export type ContrivedEventTarget<
  E extends Partial<AnyEventTarget> = Partial<HTMLInputElement>,
> = Partial<E> & {
  value?: string
  files?: FileList
}

export type FireFunction = (element: AnyEventTarget, event?: Event) => boolean

export type FireObject = {
  [K in EventType]: <N extends AnyEventTarget = HTMLElement>(
    element: N,
    init?: CreateFunctionInit<K, N>,
  ) => boolean
}

export type CreateFunctionInit<
  EVTNAME extends EventType = EventType,
  N extends AnyEventTarget = HTMLElement,
> = Partial<EventMapValueEventInit<EVTNAME>> & {
  target?: ContrivedEventTarget<N> | null
  /**
   * Should technically be `any` or some inferred type based on EventMapValueEventInit<EVTNAME>['detail'],
   * but for some reason, the 2nd arg of the union of the Event or Event-derivative constructors in
   * events.ts#__createEvent ( `event = new EventConstructor(eventName, eventInit)` ) expects details to be a number | undefined
   *
   * @type {number}
   */
  detail?: number | undefined
}

export type CreateFunction<
  EVTNAME extends EventType = EventType,
  N extends AnyEventTarget = HTMLElement,
> = (
  eventName: EVTNAME,
  node?: N,
  init?: CreateFunctionInit<EVTNAME, N>,
  options?: {
    EventType?: EventMapValue<EVTNAME>['EventType']
    defaultInit?: Partial<EventMapValue<EVTNAME>['defaultInit']>
  },
) => EventMapValueEvent<EVTNAME>

export type CreateObject = {
  [K in EventType]: <
    N extends AnyEventTarget = Document | Element | Window | Node,
  >(
    node: N,
    eventProperties?: CreateFunctionInit<K, N>,
  ) => EventMapValueEvent<K>
}

export const createEvent: CreateObject & CreateFunction
export const fireEvent: FireFunction & FireObject
