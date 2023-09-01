import { ModelLoader } from "../../core/ModelLoader"

export class Telescope {
  private static loader: ModelLoader = new ModelLoader()

  static async object() {
    const telescope = await this.loader.load("/Telescope/scene.gltf")

    telescope.scale.set(-0.1, 0.1, 0.1)
    telescope.position.set(-1.7, 0.35, 0.5)

    telescope.name = "telescópio"

    return telescope
  }
}
