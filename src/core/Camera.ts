import { PerspectiveCamera } from "three"

export class Camera extends PerspectiveCamera {
  constructor() {
    // Set camera fov, aspect ratio, near and far
    super(45, innerWidth / innerHeight, 0.1, 100)

    // Update camera aspect ratio on window resize
    addEventListener("resize", () => {
      super.aspect = innerWidth / innerHeight
      super.updateProjectionMatrix()
    })
  }
}
