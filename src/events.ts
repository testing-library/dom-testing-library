import type {
  AnyEventTarget,
  ContrivedEventTarget,
  CreateFunctionInit,
  CreateObject,
  EventMapValue,
  EventMapValueEvent,
  EventType,
  FireFunction,
  FireObject,
} from '../types'
import {getConfig} from './config'
import {eventAliasMap, eventMap} from './event-map'
import {getWindowFromNode} from './helpers'

const _fireEvent: FireFunction & Partial<FireObject> = (
  element?: AnyEventTarget,
  event?: Event,
): boolean => {
  return getConfig().eventWrapper(() => {
    if (!event) {
      throw new Error(
        `Unable to fire an event - please provide an event object.`,
      )
    }
    if (!element) {
      throw new Error(
        `Unable to fire a "${event.type}" event - please provide a DOM element.`,
      )
    }
    return element.dispatchEvent(event)
  })
}

/**
 *
 * This function's return type is tricky.
 * If in IE11 or other environments where window/globalThis does not contain properties for each type of DOM Event Class,
 * it returns the value of `window.document.createEvent(typeof eventType) & init`.
 * In all other environments, it simply returns the Event or Event-like object constructed by `new window[typeof eventType]()`
 *
 * I'm not sure how best to represent this in TS. For now, I will specify its return type as if it is invoked in the latter case.
 */
const __createEvent = <EVTNAME extends EventType, N extends AnyEventTarget>(
  eventName: EVTNAME,
  node?: N,
  /**
   * Caveat: the type of `init` is tricky.
   * If in an environment that exposes an Event-extending class per Event type name in `window` or `globalThis`,
   * its type is that of the corresponding EventInit or EventInit-like interface.
   *
   * Eg: If:
   *
   * 1. Aforemention environmental conditions are met
   * 2. And eventName extends keyof typeof window (eg eventName === "MouseEvent", etc)
   * 3. Then init will/should be (at least partially) MouseEventInit, as determined by the 2nd argument for the MouseEvent constructor, etc
   *
   * However, if in an environment (eg IE11) where there does not exist such Event classes in window/globalThis, or if said property is not a Class,
   * `init` can be more correctly regarded as being of type Omit< MyEvent , 'bubbles' | 'cancelable' | 'detail' >,
   * where MyEvent is the actual Event derivative being created. That is, `init` is not so much an EventInit-like object so much as an Event-like one.
   * Technically, whatever `init` is, in the IE11 case, its properties will be merged with the Event that gets created, so it could have any shape,
   * including one that might violate any constraints that assumed the return of this function to be a "legal" DOM Event or derivative thereof.
   *
   * Given that the IE11 case is the edge case, I have defined `init` somewhat broadly, but with preference given to its type as being that of an EventInit-like object.
   *
   * In all cases, init may optionally define 'dataTransfer' and 'clipboardData' properties as well,
   * which are special cases for which the created Event object is explicity assigned as properties.
   * No attempt is made to verify whether those properties would reasonably exist on an Event of the created type.
   *
   * In addition, `init` may also define a `target` property and a `detail` property.
   *
   * `target`: should most probably take the shape of the same `node` that this Event is created against,
   * thus, eg. a click event's `target` prop should point to the element that was clicked on,
   * which should be the element passed as the first param to this function. However,
   * its usage implies the existence of a couple of optional properties - `files` and `value`,
   * whose types (taken from HTMLInputElement, their most likely containing object) I've explicitly intersected with their sole accesses below.
   *
   * `detail`: is only correctly used in the first case from the above-mentioned environmental Event class considerations, where it is passed to the event constructor.
   * In those cases its type is varied, and dependent on the Event in question.
   *
   * Part of their justification lies within usages of their types in this function, instances of which will be commented on inline.
   *
   */
  init?: CreateFunctionInit<EVTNAME, N>,
  {
    EventType: eventType = 'Event',
    defaultInit = {},
  }: {
    EventType?: EventMapValue<EVTNAME>['EventType']
    defaultInit?: Partial<EventMapValue<EVTNAME>['defaultInit']>
  } = {},
): EventMapValueEvent<EVTNAME> => {
  if (!node) {
    throw new Error(
      `Unable to fire a "${eventName}" event - please provide a DOM element.`,
    )
  }

  const eventInit = {
    ...defaultInit,
    ...init,
  }
  const target = eventInit.target
  const {value, files, ...targetProperties} = (target ??
    {}) as ContrivedEventTarget<NonNullable<typeof target>>

  // value is non-nullable, according to its type
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (value !== undefined) {
    setNativeValue(node, value)
  }
  // files is non-nullable, according to its type
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  // if/when `src/helpers.js` is TS-ified explicit type annotation for `window` will not be required.
  // In addition, usage of window below involve no null-checks,
  // suggesting that a nil type for `window` will never be the case, so I've non null asserted it here
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const window: Window & typeof globalThis = getWindowFromNode(node)!
  // ostensibly window[eventType] is never undefined/null,
  // so the falling back to window.Event can only exist if eslint is ignored here
  // Though I am not sure, it might be an IE thing 🤷‍♀️
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const EventConstructor = window[eventType] ?? window.Event
  let event: typeof EventConstructor['prototype']
  /* istanbul ignore else */
  if (typeof EventConstructor === 'function') {
    event = new EventConstructor(eventName, eventInit)
  } else {
    // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
    event = window.document.createEvent(eventType)
    const {bubbles, cancelable, detail, ...otherInit} = eventInit

    event.initEvent(
      eventName,
      bubbles,
      cancelable,
      // @ts-expect-error I cannot find any resource on the internet or in lib.dom.d.ts of this mysterious 4th argument,
      // except for the similar method `initCustomEvent` on `CustomEvent`.
      // Is this a mistake? Or is `event` supposed to be a CustomEvent? Still wouldn't work, as method name is different!
      detail,
    )
    Object.keys(otherInit).forEach(
      // @ts-expect-error `eventKey`'s type being explicitly cast to
      // `keyof typeof Omit<typeof event, 'bubbles' | 'cancelable' | 'detail'>`
      // is as good as what it actually is. For what it's worth,
      // it would have been cast as such in each instance of its use to index both `event` and `otherInit` as Object.keys() returns an array of simple strings,
      // which are not specified in any index signatures for either object.
      //
      // The reason `otherInit` is cast to Omit<typeof event, 'bubbles' | 'cancelable' | 'detail'>
      // is because in this branch of the if-else,
      // otherInit is a simple object whose propertes are intended to be merged with `event`,
      // therefore, in terms of its usage in Object.keys().forEach(),
      // it is as good as being a subset of `event`,
      // for the purposes of easily using its keys to index `event`
      //
      // The other less verbose option is to explicitly asert `otherInit`'s type once during its assignment above
      (
        eventKey: keyof Omit<typeof event, 'bubbles' | 'cancelable' | 'detail'>,
      ) => {
        event[eventKey] = (
          otherInit as Omit<typeof event, 'bubbles' | 'cancelable' | 'detail'>
        )[eventKey]
      },
    )
  }

  // DataTransfer is not supported in jsdom: https://github.com/jsdom/jsdom/issues/1568
  const dataTransferProperties = [
    'dataTransfer' as const,
    'clipboardData' as const,
  ]
  dataTransferProperties.forEach(dataTransferKey => {
    const dataTransferValue: null | DataTransfer = (
      eventInit as DragEvent & ClipboardEvent
    )[dataTransferKey]

    if (typeof dataTransferValue === 'object') {
      /* istanbul ignore if  */
      if (typeof window.DataTransfer === 'function') {
        Object.defineProperty(event, dataTransferKey, {
          value: Object.getOwnPropertyNames(dataTransferValue).reduce(
            (acc, propName) => {
              Object.defineProperty(acc, propName, {
                value: dataTransferValue?.[propName as keyof DataTransfer],
              })
              return acc
            },
            new window.DataTransfer(),
          ),
        })
      } else {
        Object.defineProperty(event, dataTransferKey, {
          value: dataTransferValue,
        })
      }
    }
  })

  return event
}

const _createEvent: typeof __createEvent & Partial<CreateObject> = __createEvent

Object.keys(eventMap).forEach(((
  key: Extract<EventType, keyof typeof eventMap>,
) => {
  const evt = eventMap[key]
  const {EventType: eType, defaultInit} = evt
  const eventName = key.toLowerCase() as Lowercase<typeof key>

  // @ts-expect-error For some reason, I annot assign the RHS to the LHS for the following arg:
  // Error below:
  //
  //   Type '<N extends AnyEventTarget>(node: N, init?: CreateFunctionInit<"copy" | "cut" | "paste" | "compositionEnd" | "compositionStart" | "compositionUpdate" | "keyDown" | "keyPress" | "keyUp" | "focus" | ... 72 more ... | "popState", N> | undefined) => Event | ... 14 more ... | PopStateEvent' is not assignable to type '(<N extends AnyEventTarget = HTMLElement>(node: N, eventProperties?: CreateFunctionInit<"copy", N> | undefined) => ClipboardEvent) & ... 81 more ... & (<N extends AnyEventTarget = HTMLElement>(node: N, eventProperties?: CreateFunctionInit<...> | undefined) => PopStateEvent)'.
  //   Type '<N extends AnyEventTarget>(node: N, init?: CreateFunctionInit<"copy" | "cut" | "paste" | "compositionEnd" | "compositionStart" | "compositionUpdate" | "keyDown" | "keyPress" | "keyUp" | "focus" | ... 72 more ... | "popState", N> | undefined) => Event | ... 14 more ... | PopStateEvent' is not assignable to type '<N extends AnyEventTarget = HTMLElement>(node: N, eventProperties?: CreateFunctionInit<"copy", N> | undefined) => ClipboardEvent'.
  //     Type 'Event | ClipboardEvent | CompositionEvent | UIEvent | KeyboardEvent | FocusEvent | InputEvent | ... 8 more ... | PopStateEvent' is not assignable to type 'ClipboardEvent'.
  //       Property 'clipboardData' is missing in type 'Event' but required in type 'ClipboardEvent'.ts(2322)
  // lib.dom.d.ts(3593, 14): 'clipboardData' is declared here.
  _createEvent[key] = <N extends AnyEventTarget>(
    node: N,
    init?: CreateFunctionInit<typeof key, typeof node>,
  ) =>
    _createEvent<typeof key, typeof node>(eventName as typeof key, node, init, {
      EventType: eType,
      defaultInit,
    })

  _fireEvent[key] = <N extends AnyEventTarget = HTMLElement>(
    node: N,
    /**
     * This is in one sense CreateFunctionInit<typeof key, N>,
     * but it is also technically and literally Parameters<NonNullable<typeof _fireEvent[typeof key]>>[1]
     * ( the second parameter of the function at this property ),
     * the latter of which raises no errors. For whatever reason,
     * the former does, even if that's what it has to be asserted as when passed to _createEvent[key]()
     */
    init?: Parameters<NonNullable<typeof _fireEvent[typeof key]>>[1],
  ) =>
    _fireEvent(
      node,
      // non null assertion due to guaranteed assignment in previous line
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      _createEvent[key]!(node, init as CreateFunctionInit<typeof key, N>),
    )
}) as (value: string, index: number, array: string[]) => void)

// function written after some investigation here:
// https://github.com/facebook/react/issues/10135#issuecomment-401496776
function setNativeValue(element: AnyEventTarget, value: string) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {set: valueSetter} =
    Object.getOwnPropertyDescriptor(element, 'value') ?? {}
  const prototype: unknown = Object.getPrototypeOf(element)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {set: prototypeValueSetter} =
    Object.getOwnPropertyDescriptor(prototype, 'value') ?? {}
  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value)
  } /* istanbul ignore next (I don't want to bother) */ else if (valueSetter) {
    valueSetter.call(element, value)
  } else {
    throw new Error('The given element does not have a value setter')
  }
}

;(Object.keys(eventAliasMap) as Array<keyof typeof eventAliasMap>).forEach(
  aliasKey => {
    const key = eventAliasMap[aliasKey]
    // @ts-expect-error What do we do here? Technically, _fireEvent[key] might not exist by this time,
    // in which case the assignment will have the type of the correct Function | undefined,
    // which violates the expected type.
    // However, exposing fireEvent which this type would be a poor UX for users,
    // and doesn't make sense given automated tssts would ensure the accessed "methods" do exist.
    // Should I just ignore the error like this?
    _fireEvent[aliasKey] = (...args: Parameters<FireObject[typeof key]>) =>
      _fireEvent[key]?.(...args)
  },
)

export const fireEvent = _fireEvent as typeof _fireEvent &
  Required<Pick<typeof _fireEvent, EventType>>
export const createEvent = _createEvent as typeof _createEvent &
  Required<Pick<typeof _createEvent, EventType>>
