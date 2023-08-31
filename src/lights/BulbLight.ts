import { PointLight, PointLightHelper, Vector3 } from "three"

type BulbLightProps = {
  x: Vector3["x"]
  y: Vector3["y"]
  z: Vector3["z"]
}

export class BulbLight extends PointLight {
  constructor({ x, y, z }: BulbLightProps) {
    super("#eae664", 0.4, 3, 1)

    this.position.set(x, y, z)
    this.castShadow = true
    this.receiveShadow = true
    this.shadow.bias = -0.001
    this.shadow.mapSize.width = 1024 * 2
    this.shadow.mapSize.height = 1024 * 2
  }

  get helper() {
    return new PointLightHelper(this, 0.1, "#7e7a07")
  }
}
