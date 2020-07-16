export declare type EventMapKey =
  | 'copy'
  | 'cut'
  | 'paste'
  | 'compositionEnd'
  | 'compositionStart'
  | 'compositionUpdate'
  | 'keyDown'
  | 'keyPress'
  | 'keyUp'
  | 'focus'
  | 'blur'
  | 'focusIn'
  | 'focusOut'
  | 'change'
  | 'input'
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
declare type LegacyKeyboardEventInit = {
  charCode?: number
} & KeyboardEventInit
declare type EventMapValue =
  | {
      EventType: 'AnimationEvent'
      defaultInit: AnimationEventInit
    }
  | {
      EventType: 'ClipboardEvent'
      defaultInit: ClipboardEventInit
    }
  | {
      EventType: 'CompositionEvent'
      defaultInit: CompositionEventInit
    }
  | {
      EventType: 'DragEvent'
      defaultInit: DragEventInit
    }
  | {
      EventType: 'Event'
      defaultInit: EventInit
    }
  | {
      EventType: 'FocusEvent'
      defaultInit: FocusEventInit
    }
  | {
      EventType: 'KeyboardEvent'
      defaultInit: LegacyKeyboardEventInit
    }
  | {
      EventType: 'InputEvent'
      defaultInit: InputEventInit
    }
  | {
      EventType: 'MouseEvent'
      defaultInit: MouseEventInit
    }
  | {
      EventType: 'PointerEvent'
      defaultInit: PointerEventInit
    }
  | {
      EventType: 'PopStateEvent'
      defaultInit: PopStateEventInit
    }
  | {
      EventType: 'ProgressEvent'
      defaultInit: ProgressEventInit
    }
  | {
      EventType: 'TouchEvent'
      defaultInit: TouchEventInit
    }
  | {
      EventType: 'TransitionEvent'
      defaultInit: TransitionEventInit
    }
  | {
      EventType: 'UIEvent'
      defaultInit: UIEventInit
    }
  | {
      EventType: 'WheelEvent'
      defaultInit: WheelEventInit
    }
export declare const eventMap: Record<EventMapKey, EventMapValue>
declare type EventAliasMapKey = 'doubleClick'
export declare const eventAliasMap: Record<EventAliasMapKey, EventMapKey>
export declare type EventType = EventMapKey | EventAliasMapKey
export {}
