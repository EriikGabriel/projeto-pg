import { Mesh, Object3D } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

export class ModelLoader {
  private loader: GLTFLoader

  constructor() {
    this.loader = new GLTFLoader()
  }

  async load(url: string) {
    const data = await this.loader.loadAsync(url)

    const model = data.scene.children[0]

    this.loadShadows(model)

    return model
  }

  async loadShadows(model: Object3D) {
    model.traverse((n) => {
      if (n instanceof Mesh) {
        n.castShadow = true
        n.receiveShadow = true

        if (n.material.map) n.material.map.anisotropy = 16
      }
    })
  }
}
