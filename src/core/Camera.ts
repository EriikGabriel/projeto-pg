import { PerspectiveCamera } from "three"

export class Camera extends PerspectiveCamera {
  constructor() {
    // Set camera fov, aspect ratio, near and far
    super(500, innerWidth / innerHeight, 0.1, 10000)

    // Update camera aspect ratio on window resize
    addEventListener("resize", () => {
      super.aspect = innerWidth / innerHeight
      super.updateProjectionMatrix()
    })
  }
}
