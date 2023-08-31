import { Mesh, MeshPhongMaterial, SphereGeometry } from "three"

import { TextureLoader } from "three"

export class Jupiter extends Mesh {
  private sphereMesh: Mesh

  constructor() {
    super()

    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("jupiter.jpg")

    const geometry = new SphereGeometry()
    const material = new MeshPhongMaterial({ map: texture })

    this.sphereMesh = new Mesh(geometry, material)
  }

  get model() {
    return this.sphereMesh
  }
}
