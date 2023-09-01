import { ModelLoader } from "../../core/ModelLoader"

export class Telescope {
  private static loader: ModelLoader = new ModelLoader()

  static async object() {
    // Carrega o modelo do telescópio
    const telescope = await this.loader.load("/Telescope/scene.gltf")

    // Redimensiona o telescópio
    telescope.scale.set(-0.1, 0.1, 0.1)
    // Posiciona o telescópio no quarto
    telescope.position.set(-1.7, 0.35, 0.5)

    // Define o nome do objeto
    telescope.name = "telescópio"

    return telescope
  }
}
