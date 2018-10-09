let testWindow = typeof window === 'undefined' ? undefined : window

if (typeof window === 'undefined') {
  const {JSDOM} = require('jsdom')
  const dom = new JSDOM()
  testWindow = dom.window
}

// TODO: these events are not supported by JSDOM so we need to shim them

if (!testWindow.ClipboardEvent) {
  testWindow.ClipboardEvent = class ClipboardEvent extends testWindow.Event {}
}

if (!testWindow.DragEvent) {
  testWindow.DragEvent = class DragEvent extends testWindow.Event {}
}

if (!testWindow.TransitionEvent) {
  testWindow.TransitionEvent = class TransitionEvent extends testWindow.Event {}
}

if (!testWindow.AnimationEvent) {
  testWindow.AnimationEvent = class AnimationEvent extends testWindow.Event {}
}

if (!testWindow.AnimationEvent) {
  testWindow.AnimationEvent = class AnimationEvent extends testWindow.Event {}
}

if (!testWindow.InputEvent) {
  testWindow.InputEvent = class InputEvent extends testWindow.Event {}
}

module.exports = testWindow.document
