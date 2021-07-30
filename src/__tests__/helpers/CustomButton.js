export class CustomButton extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({mode: 'open'})

    const button = document.createElement('button')
    button.innerHTML = 'Button text'

    this.shadowRoot.append(button)
  }
}
