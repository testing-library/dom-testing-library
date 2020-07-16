import {getConfig} from './config'
import {getWindowFromNode} from './helpers'
import {eventMap, EventMapKey, eventAliasMap, EventType} from './event-map'

declare global {
  // FIXME we should not augment the interface here
  interface Window {
    DataTransfer: () => void
    Event: () => void
  }
}

function internalfireEvent(element: EventTarget, event: Event) {
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

function isDragEventInit(eventInit: unknown): eventInit is DragEventInit {
  return typeof (eventInit as DragEventInit).dataTransfer === 'object'
}

type EventTargetWithFiles = HTMLInputElement
type EventTargetWithValue =
  | HTMLInputElement
  | HTMLButtonElement
  | HTMLOutputElement

type CreateObject = {
  [K in EventType]: (
    //element: Document | Element | Window | Node,
    element: EventTarget,
    options?: {},
  ) => Event
}
const createEvent = {} as CreateObject

Object.keys(eventMap).forEach((key: EventMapKey) => {
  const {EventType, defaultInit} = eventMap[key]
  const eventName = key.toLowerCase()

  createEvent[key] = (node, init) => {
    if (!node) {
      throw new Error(
        `Unable to fire a "${key}" event - please provide a DOM element.`,
      )
    }
    const eventInit: EventInit = {...defaultInit, ...init}
    const {target = {}} = eventInit as Event
    const {value, files, ...targetProperties} = target as Partial<
      EventTargetWithValue & EventTargetWithFiles
    >
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
    let event
    /* istanbul ignore else  */
    if (typeof EventConstructor === 'function') {
      event = new EventConstructor(eventName, eventInit)
    } else {
      // IE11 polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
      event = window.document.createEvent(EventType)
      const {bubbles, cancelable, detail, ...otherInit} = eventInit as Partial<
        UIEvent
      >
      event.initEvent(eventName, bubbles, cancelable, detail)
      Object.keys(otherInit).forEach(eventKey => {
        event[eventKey] = otherInit[eventKey]
      })
    }

    if (isDragEventInit(eventInit)) {
      const {dataTransfer} = eventInit
      // DataTransfer is not supported in jsdom: https://github.com/jsdom/jsdom/issues/1568
      /* istanbul ignore if  */
      if (typeof window.DataTransfer === 'function') {
        Object.defineProperty(event, 'dataTransfer', {
          value: Object.assign(new window.DataTransfer(), dataTransfer),
        })
      } else {
        Object.defineProperty(event, 'dataTransfer', {
          value: dataTransfer,
        })
      }
    }
    return event
  }

  internalfireEvent[key] = (node: EventTarget, init) =>
    internalfireEvent(node, createEvent[key](node, init))
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

Object.keys(eventAliasMap).forEach(aliasKey => {
  const key = eventAliasMap[aliasKey]
  internalfireEvent[aliasKey] = (...args) => fireEvent[key](...args)
})

type FireEventAsFunction = (element: EventTarget, event: Event) => boolean
type FireEventAsHelper = Record<
  EventType,
  (element: EventTarget, init?: unknown) => boolean
>
type FireEvent = FireEventAsFunction & FireEventAsHelper

const fireEvent = internalfireEvent as FireEvent
export {fireEvent, createEvent}

/* eslint complexity:["error", 9] */
