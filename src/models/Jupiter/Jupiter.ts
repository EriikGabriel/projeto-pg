import { Mesh, MeshPhongMaterial, SphereGeometry } from "three"

import { TextureLoader } from "three"

export class Jupiter extends Mesh {
  constructor() {
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("Jupiter/jupiter.jpg")

    const geometry = new SphereGeometry()
    const material = new MeshPhongMaterial({ map: texture })

    super(geometry, material)
  }
}
