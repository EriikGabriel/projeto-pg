import { Color, SpotLight, SpotLightHelper, Vector3 } from "three"

type MoonLightProps = {
  x: Vector3["x"]
  y: Vector3["y"]
  z: Vector3["z"]
}

export class MoonLight extends SpotLight {
  constructor({ x, y, z }: MoonLightProps) {
    super("#ffffff", 15)

    this.position.set(x, y, z)
    this.castShadow = true
    this.shadow.bias = -0.001
    this.shadow.mapSize.width = 1024 * 10
    this.shadow.mapSize.height = 1024 * 10
  }

  get helper() {
    return new SpotLightHelper(this, new Color("#ffffff"))
  }
}
