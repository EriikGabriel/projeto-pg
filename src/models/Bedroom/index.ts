import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three"
import { ModelLoader } from "../../core/ModelLoader"

export class Bedroom {
  private static loader: ModelLoader = new ModelLoader()

  static async object() {
    const bedroom = new Group()

    const bedroomInterior = await this.loader.load("/Bedroom/scene.gltf")

    // Create material
    const material = new MeshPhongMaterial({ color: "#A3A580" })

    // Create left wall with geometry
    const geometryVertical = new BoxGeometry(4.15, 2.02, 0.05)
    const wallLeft = new Mesh(geometryVertical, material)
    this.loader.loadShadows(wallLeft)
    wallLeft.position.set(2.09, 1.01, 0.3)
    wallLeft.rotation.y = Math.PI / 2

    // Create back wall with geometry
    const geometryHorizontal = new BoxGeometry(4.23, 2.02, 0.05)
    const wallBack = new Mesh(geometryHorizontal, material)
    this.loader.loadShadows(wallBack)
    wallBack.position.set(0, 1.01, 2.336)

    const geometryTop = new BoxGeometry(4.23, 4.14, 0.05)
    const roof = new Mesh(geometryTop, material)
    this.loader.loadShadows(roof)
    roof.position.set(0, 1.99, 0.25)

    roof.rotation.x = Math.PI / 2

    bedroom.add(bedroomInterior, wallLeft, wallBack, roof)

    return bedroom
  }
}
