import {EventType} from './event-map'
declare global {
  interface Window {
    DataTransfer: () => void
    Event: () => void
  }
}
declare type CreateObject = {
  [K in EventType]: (element: EventTarget, options?: {}) => Event
}
declare const createEvent: CreateObject
declare type FireEventAsFunction = (
  element: EventTarget,
  event: Event,
) => boolean
declare type FireEventAsHelper = Record<
  EventType,
  (element: EventTarget, init?: unknown) => boolean
>
declare type FireEvent = FireEventAsFunction & FireEventAsHelper
declare const fireEvent: FireEvent
export {fireEvent, createEvent}
