declare type EventMapKey = string
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
export declare const eventAliasMap: Record<string, string>
export {}
