import React from 'react'
import {mount, unmount} from './helpers/react'
import {fireEvent} from '../'

describe('Clipboard Events', () => {
  ;['copy', 'paste'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('input')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Composition Events', () => {
  ;['compositionEnd', 'compositionStart', 'compositionUpdate'].forEach(
    eventName => {
      it(`fires ${eventName}`, () => {
        const node = document.createElement('input')
        const spy = jest.fn()
        node.addEventListener(eventName.toLowerCase(), spy)
        fireEvent[eventName](node)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    },
  )
})

describe('Keyboard Events', () => {
  ;['keyDown', 'keyPress', 'keyUp'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('input')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Focus Events', () => {
  ;['focus', 'blur'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('input')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Form Events', () => {
  ;['change', 'input', 'invalid'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('input')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
  ;['submit'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('form')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Mouse Events', () => {
  ;[
    'click',
    'contextMenu',
    'dblClick',
    'drag',
    'dragEnd',
    'dragEnter',
    'dragExit',
    'dragLeave',
    'dragOver',
    'dragStart',
    'drop',
    'mouseDown',
    'mouseEnter',
    'mouseLeave',
    'mouseMove',
    'mouseOut',
    'mouseOver',
    'mouseUp',
  ].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('button')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Selection Events', () => {
  ;['select'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('input')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Touch Events', () => {
  ;['touchCancel', 'touchEnd', 'touchMove', 'touchStart'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('button')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('UI Events', () => {
  ;['scroll'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Wheel Events', () => {
  ;['wheel'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Media Events', () => {
  ;[
    'abort',
    'canPlay',
    'canPlayThrough',
    'durationChange',
    'emptied',
    'encrypted',
    'ended',
    'error',
    'loadedData',
    'loadedMetadata',
    'loadStart',
    'pause',
    'play',
    'playing',
    'progress',
    'rateChange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeUpdate',
    'volumeChange',
    'waiting',
  ].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('video')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Image Events', () => {
  ;['load', 'error'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('img')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Animation Events', () => {
  ;['animationStart', 'animationEnd', 'animationIteration'].forEach(
    eventName => {
      it(`fires ${eventName}`, () => {
        const node = document.createElement('div')
        const spy = jest.fn()
        node.addEventListener(eventName.toLowerCase(), spy)
        fireEvent[eventName](node)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    },
  )
})

describe('Transition Events', () => {
  ;['transitionEnd'].forEach(eventName => {
    it(`fires ${eventName}`, () => {
      const node = document.createElement('div')
      const spy = jest.fn()
      node.addEventListener(eventName.toLowerCase(), spy)
      fireEvent[eventName](node)
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('Alias Events', () => {
  it(`fires doubleClick`, () => {
    const node = document.createElement('button')
    const spy = jest.fn()
    node.addEventListener('dblclick', spy)
    fireEvent.doubleClick(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})

describe('React Events', () => {
  afterEach(unmount)

  // todo figure out why this test is broken
  it.skip(`triggers onChange`, () => {
    let node
    const spy = jest.fn()

    mount(
      React.createElement('input', {
        onChange: spy,
        ref: el => (node = el),
      }),
    )

    fireEvent.change(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it(`triggers onMouseEnter`, () => {
    let node
    const spy = jest.fn()

    mount(
      React.createElement('div', {
        onMouseEnter: spy,
        ref: el => (node = el),
      }),
    )

    fireEvent.mouseEnter(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it(`triggers onMouseLeave`, () => {
    let node
    const spy = jest.fn()

    mount(
      React.createElement('div', {
        onMouseLeave: spy,
        ref: el => (node = el),
      }),
    )

    fireEvent.mouseLeave(node)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
