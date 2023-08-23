import { WebGLRenderer } from "three"

export class Renderer extends WebGLRenderer {
  constructor(canvas: HTMLCanvasElement) {
    // Set renderer canvas and antialiasing
    super({ canvas, antialias: true })

    // Set renderer size to window size
    this.setSize(innerWidth, innerHeight)

    // Update renderer size on window resize
    addEventListener("resize", () => {
      this.setSize(innerWidth, innerHeight)
      this.setPixelRatio(Math.min(devicePixelRatio, 2))
    })
  }
}
