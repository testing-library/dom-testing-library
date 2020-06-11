const observed = ['value']

class CustomEl extends HTMLElement {
  static getObservedAttributes() {
    return observed
  }

  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.innerHTML = `<input>`
    this.$input = this.shadowRoot.querySelector('input')
  }

  connectedCallback() {
    observed.forEach(name => {
      this.render(name, this.getAttribute(name))
    })
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return
    this.render(name, newVal)
  }

  render(name, value) {
    if (value == null) {
      this.$input.removeAttribute(name)
    } else {
      this.$input.setAttribute(name, value)
    }
  }
}

customElements.define('custom-el', CustomEl)
