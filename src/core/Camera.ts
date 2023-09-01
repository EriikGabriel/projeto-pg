import { PerspectiveCamera } from "three"

export class Camera extends PerspectiveCamera {
  constructor() {
    // Define o campo de visão, aspect ratio, near e far plane
    super(45, innerWidth / innerHeight, 0.1, 1000)

    // Atualiza o aspect ratio da câmera quando a janela é redimensionada
    addEventListener("resize", () => {
      super.aspect = innerWidth / innerHeight
      super.updateProjectionMatrix()
    })
  }
}
