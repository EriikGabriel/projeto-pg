import { Euler } from "three"

type InputControllerOptions = {
  leftButton: boolean
  rightButton: boolean
  mouseXDelta: number
  mouseYDelta: number
  mouseX: number
  mouseY: number
}

export class PlayerControls {
  target: HTMLElement
  current: InputControllerOptions
  previous: InputControllerOptions | null
  keys: { [key: string]: boolean }
  euler: Euler

  constructor(target: HTMLElement) {
    this.target = target || document

    this.current = {
      leftButton: false,
      rightButton: false,
      mouseXDelta: 0,
      mouseYDelta: 0,
      mouseX: 0,
      mouseY: 0,
    }
    this.previous = null
    this.keys = {}
    this.euler = new Euler(0, 0, 0, "YXZ")

    this.initialize_()
  }

  initialize_() {
    addEventListener("mousedown", (e) => this.onMouseDown_(e), false)
    addEventListener("mousemove", (e) => this.onMouseMove_(e), false)
    addEventListener("mouseup", (e) => this.onMouseUp_(e), false)
    addEventListener("keydown", (e) => this.onKeyDown_(e), false)
    addEventListener("keyup", (e) => this.onKeyUp_(e), false)
  }

  onMouseMove_(e: MouseEvent) {
    this.current.mouseX = e.movementX
    this.current.mouseY = e.movementY

    if (this.previous === null) {
      this.previous = { ...this.current }
    }

    this.current.mouseXDelta = this.current.mouseX
    this.current.mouseYDelta = this.current.mouseY
  }

  onMouseDown_(e: MouseEvent) {
    this.onMouseMove_(e)

    switch (e.button) {
      case 0: {
        this.current.leftButton = true
        break
      }
      case 2: {
        this.current.rightButton = true
        break
      }
    }
  }

  onMouseUp_(e: MouseEvent) {
    this.onMouseMove_(e)

    switch (e.button) {
      case 0: {
        this.current.leftButton = false
        break
      }
      case 2: {
        this.current.rightButton = false
        break
      }
    }
  }

  onKeyDown_(e: KeyboardEvent) {
    this.keys[e.code] = true
  }

  onKeyUp_(e: KeyboardEvent) {
    this.keys[e.code] = false
  }

  key(code: string) {
    return !!this.keys[code]
  }

  isReady() {
    return this.previous !== null
  }

  update() {
    if (this.previous !== null) {
      this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX
      this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY

      this.previous = { ...this.current }
    }
  }
}
