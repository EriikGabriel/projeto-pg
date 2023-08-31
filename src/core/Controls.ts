import { Camera } from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export class Controls extends OrbitControls {
  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    super(camera, canvas)
  }
}
