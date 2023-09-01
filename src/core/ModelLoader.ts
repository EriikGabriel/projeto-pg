import { Mesh, Object3D } from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

export class ModelLoader {
  private loader: GLTFLoader

  constructor() {
    // Cria um loader para carregar modelos GLTF
    this.loader = new GLTFLoader()
  }

  async load(url: string) {
    // Carrega o modelo
    const data = await this.loader.loadAsync(url)

    const model = data.scene.children[0]

    // Carrega as sombras do modelo
    this.loadShadows(model)

    return model
  }

  async loadShadows(model: Object3D) {
    model.traverse((n) => {
      // Verifica se o nó atual do objeto é uma malha
      if (n instanceof Mesh) {
        // Habilita as sombras para a malha
        n.castShadow = true
        n.receiveShadow = true

        // Define o anisotropy para 16
        if (n.material.map) n.material.map.anisotropy = 16
      }
    })
  }
}
