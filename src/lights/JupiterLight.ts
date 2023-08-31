import { DirectionalLight, DirectionalLightHelper, Vector3 } from "three"

type JupiterLightProps = {
  x: Vector3["x"]
  y: Vector3["y"]
  z: Vector3["z"]
}

export class JupiterLight extends DirectionalLight {
  constructor({ x, y, z }: JupiterLightProps) {
    super("#ffa12f", 0.1)

    this.position.set(x, y, z)
  }

  get helper() {
    return new DirectionalLightHelper(this, 5, "#ffa12f")
  }
}
