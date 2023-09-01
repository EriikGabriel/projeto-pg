import { DirectionalLight, DirectionalLightHelper, Vector3 } from "three"

type JupiterLightProps = {
  x: Vector3["x"]
  y: Vector3["y"]
  z: Vector3["z"]
}

export class JupiterLight extends DirectionalLight {
  constructor({ x, y, z }: JupiterLightProps) {
    super("#ffa12f", 0.1)

    // Define a posição da luz
    this.position.set(x, y, z)
    // Define se a luz irá gerar sombras
    this.castShadow = true
    // Define se a luz irá receber sombras
    this.receiveShadow = true
    // Define o bias da sombra
    this.shadow.bias = -0.001
    // Define o tamanho do mapa de sombras
    this.shadow.mapSize.width = 1024 * 2
    this.shadow.mapSize.height = 1024 * 2
  }

  // Função que retorna um helper visual para a luz
  get helper() {
    return new DirectionalLightHelper(this, 5, "#ffa12f")
  }
}
