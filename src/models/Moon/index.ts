import { Mesh, MeshPhongMaterial, SphereGeometry, TextureLoader } from "three"

const textureURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"
const displacementURL =
  "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"

export class Moon extends Mesh {
  constructor() {
    const geometry = new SphereGeometry(1, 60, 60)
    const textureLoader = new TextureLoader()
    const texture = textureLoader.load(textureURL)
    const displacementMap = textureLoader.load(displacementURL)
    const material = new MeshPhongMaterial({
      color: 0xffffff,
      map: texture,
      displacementMap: displacementMap,
      displacementScale: 0.06,
      bumpMap: displacementMap,
      bumpScale: 0.04,
      reflectivity: 5,
      shininess: 100,
    })

    super(geometry, material)
  }
}
