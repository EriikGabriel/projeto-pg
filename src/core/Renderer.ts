import { PCFSoftShadowMap, ReinhardToneMapping, WebGLRenderer } from "three"

export class Renderer extends WebGLRenderer {
  constructor(canvas: HTMLCanvasElement) {
    // Define o canvas e o antialiasing
    super({ canvas, antialias: true })

    // Define o tamanho do renderizador e o tone mapping
    this.setSize(innerWidth, innerHeight)
    this.toneMapping = ReinhardToneMapping
    this.toneMappingExposure = 2.3
    this.shadowMap.enabled = true
    this.shadowMap.type = PCFSoftShadowMap

    // Atualiza o tamanho do renderizador quando a janela é redimensionada
    addEventListener("resize", () => {
      this.setSize(innerWidth, innerHeight)
      this.setPixelRatio(Math.min(devicePixelRatio, 2))
    })
  }
}
