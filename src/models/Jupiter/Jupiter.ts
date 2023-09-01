import { Mesh, MeshPhongMaterial, SphereGeometry } from "three"

import { TextureLoader } from "three"

export class Jupiter extends Mesh {
  constructor() {
    // Carrega a textura
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load("Jupiter/jupiter.jpg")

    // Cria a geometria e o material
    const geometry = new SphereGeometry()
    const material = new MeshPhongMaterial({ map: texture })

    // Cria a malha
    super(geometry, material)
  }
}
