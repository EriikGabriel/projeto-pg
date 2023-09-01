import {
  BackSide,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
} from "three"

export class Skybox extends Mesh {
  constructor(size: number = 1024) {
    // Cria um array de materiais para cada face do cubo
    const skyboxMaterial: MeshBasicMaterial[] = []
    const texture_xneg = new TextureLoader().load("Skybox/xneg.png")
    const texture_xpos = new TextureLoader().load("Skybox/xpos.png")
    const texture_yneg = new TextureLoader().load("Skybox/yneg.png")
    const texture_ypos = new TextureLoader().load("Skybox/ypos.png")
    const texture_zneg = new TextureLoader().load("Skybox/zneg.png")
    const texture_zpos = new TextureLoader().load("Skybox/zpos.png")

    // Define a textura de cada face do cubo
    skyboxMaterial.push(
      new MeshBasicMaterial({ map: texture_xpos, side: BackSide }),
      new MeshBasicMaterial({ map: texture_xneg, side: BackSide }),
      new MeshBasicMaterial({ map: texture_ypos, side: BackSide }),
      new MeshBasicMaterial({ map: texture_yneg, side: BackSide }),
      new MeshBasicMaterial({ map: texture_zpos, side: BackSide }),
      new MeshBasicMaterial({ map: texture_zneg, side: BackSide })
    )

    const skyboxGeometry = new BoxGeometry(size, size, size)

    super(skyboxGeometry, skyboxMaterial)
  }
}
