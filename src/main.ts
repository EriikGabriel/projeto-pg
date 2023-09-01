import {
  Color,
  ConeGeometry,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Scene,
  Vector2,
} from "three"

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js"

import { Camera } from "./core/Camera"
import { PlayerCamera } from "./core/PlayerCamera"
import { PlayerControls } from "./core/PlayerControls"
import { Renderer } from "./core/Renderer"
import { Skybox } from "./core/Skybox"

import { BulbLight } from "./lights/BulbLight"
import { JupiterLight } from "./lights/JupiterLight"
import { MoonLight } from "./lights/MoonLight"

import { Bedroom } from "./models/Bedroom"
import { Jupiter } from "./models/Jupiter/Jupiter"
import { Moon } from "./models/Moon"
import { Satellite } from "./models/Satellite"
import { Telescope } from "./models/Telescope"

// Pega o canvas do HTML
const canvas = document.getElementById("app") as HTMLCanvasElement

// Cria o renderizador e a câmera principal
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

// Define a posição e rotação da câmera principal
mainCamera.position.set(1.5, 1, 0)
mainCamera.rotation.set(0, 1, 0)

// Cria um array de objetos interativos
const interactiveObjects: Object3D[] = []

// Variáveis de controle
let inFieldVision = false
let isTelescopeView = false

// Variável que guarda o nome do objeto interativo atual
let interactiveObjectName: string

// Cria a cena e define a cor de fundo
const scene = new Scene()
scene.background = new Color("#080820")

// Cria um skybox (cubo com textura) e adiciona à cena
const skybox = new Skybox()
scene.add(skybox)

// Cria os controles do jogador
const playerControls = new PlayerControls(canvas)

// Cria a câmera do jogador
const playerCamera = new PlayerCamera(mainCamera, playerControls, canvas)

// Cria os controles do mouse (para mover a câmera)
const pointerControl = new PointerLockControls(mainCamera, document.body)
scene.add(pointerControl.getObject())

// Cria uma luz ambiente
const hemiLight = new HemisphereLight("#29294d", "#080820", 2)
scene.add(hemiLight)

// Cria o quarto
const bedroom = await Bedroom.object()
scene.add(bedroom)

// Cria a lâmpada
const bulbGeometry = new ConeGeometry(0.1, 0.2, 4)
const bulbMaterial = new MeshBasicMaterial({ color: "#f3e77b" })
const bulb = new Mesh(bulbGeometry, bulbMaterial)
bulb.position.set(1.47, 0.75, -1.3)
bulb.visible = false
bulb.name = "lâmpada"
scene.add(bulb)

// Cria a luz da lâmpada
const bulbLight = new BulbLight({ x: 1.47, y: 0.75, z: -1.3 })
scene.add(bulbLight)

// Cria a lua
const moon = new Moon()
moon.position.set(-30, 10, -3)
scene.add(moon)

// Cria a luz da lua
const moonLight = new MoonLight({ x: -30, y: 10, z: -3 })
scene.add(moonLight)

// Cria o satélite artificial
const satellite = new Satellite().getMesh()
satellite.scale.set(0.1, 0.1, 0.1)
satellite.position.set(-30, 10, 5)
satellite.rotation.x = Math.PI / 2
scene.add(satellite)

// Cria júpiter
const jupiter = new Jupiter()
jupiter.position.set(-60, 25, 5)
scene.add(jupiter)

// Cria a luz de júpiter
const jupiterLight = new JupiterLight({ x: -60, y: 25, z: 5 })
scene.add(jupiterLight)

// Cria o telescópio
const telescope = await Telescope.object()
scene.add(telescope)

// Cria a câmera do telescópio e define sua posição e rotação em relação ao objeto
const telescopeCamera = new Camera()
telescopeCamera.position.set(
  telescope.position.x - 5,
  telescope.position.y + 10,
  telescope.position.z
)
telescopeCamera.rotation.set(0, 1.6, 0)

// Adiciona os objetos interativos ao array
interactiveObjects.push(bulb, telescope)

// Variável que guarda o tempo do último frame
let previousFrameTime: number | null = null

process()

// Função principal que processa o jogo
function process() {
  requestAnimationFrame((t) => {
    // Adiciona um evento de clique no canvas para ativar os controles do mouse
    canvas.addEventListener("click", () => pointerControl.lock())

    if (previousFrameTime === null) previousFrameTime = t

    // Se os controles do mouse estiverem ativos, chama a função de animação
    if (pointerControl.isLocked) animate(t - previousFrameTime)

    previousFrameTime = t

    // Bloco principal
    render()
    process()
  })
}

// Renderiza a cena na tela
function render() {
  renderer.autoClear = true
  // Renderiza a cena de acordo com a câmera atual, que pode ser a câmera principal ou a do telescópio
  renderer.render(scene, isTelescopeView ? telescopeCamera : mainCamera)
  renderer.autoClear = false
}

// Função principal, responsável por animar os objetos e chamar as funções de controle e interação
function animate(timeElapsed: number) {
  const timeElapsedS = timeElapsed * 0.001

  // Rotaciona a júpiter e o satélite
  jupiter.rotateY(0.005)
  satellite.rotateY(0.005)
  satellite.rotateZ(0.005)

  // Chama a função responsável por capturar tudo o que o jogador vê e pode interagir
  playerView()

  // Se a câmera do telescópio estiver ativa, chama a função responsável por controlá-la
  if (isTelescopeView) {
    telescopeView()
  } else {
    // Se não, chama a função responsável por controlar a câmera principal do jogador
    playerCamera.update_(timeElapsedS)
  }
}

function playerView() {
  // Cria um raio de visão a partir da câmera do jogador
  playerCamera.viewRaycaster.setFromCamera(
    new Vector2(0, 0),
    pointerControl.getObject()
  )

  // Verifica se o raio de visão do jogador está colidindo com algum objeto interativo
  const intersections = playerCamera.viewRaycaster.intersectObjects(
    interactiveObjects,
    true
  )

  // Pega o elemento HTML que mostra a tecla de interação e o texto
  const interactDiv = document.getElementById("interact-key") as HTMLDivElement
  const interactText = document.querySelector(
    "#interact-key p"
  ) as HTMLParagraphElement

  // Verifica se o jogador está olhando para algum objeto interativo
  const onObject = intersections.length > 0

  if (onObject) {
    intersections.forEach((intersection) => {
      // Pega o objeto interativo
      const object = intersection.object.parent?.parent ?? intersection.object

      // Mostra o texto de interação e define o nome do objeto interativo atual
      interactText.textContent = `Interagir com ${object?.name}`
      interactDiv.style.display = "flex"

      interactiveObjectName = object?.name ?? ""

      // Define que o jogador está olhando para um objeto interativo
      inFieldVision = true
    })
  } else {
    // Esconde o texto de interação e define que o jogador não está olhando para nenhum objeto interativo
    interactDiv.style.display = "none"
    inFieldVision = false
  }

  // Adiciona um evento de clique no canvas para interagir com o objeto
  addEventListener("click", () => interactiveMap(interactiveObjectName))
}

// Função responsável por mapear os objetos interativos e definir o que acontece quando o jogador interage com eles
function interactiveMap(objectName: string) {
  if (inFieldVision) {
    switch (objectName) {
      // Caso o objeto seja a lâmpada, liga ou desliga a luz
      case "lâmpada":
        bulbLight.intensity = bulbLight.intensity === 0 ? 0.4 : 0
        break
      // Caso o objeto seja o telescópio, muda para a câmera do telescópio
      case "telescópio":
        changeToTelescopeView()
        break
      default:
        break
    }
  }
}

function telescopeView() {
  let lookingAt: string
  let isZoomed = false

  // Adiciona um evento de clique no canvas para manipular os controles da câmera do telescópio
  addEventListener("keydown", (e) => {
    switch (e.key.toUpperCase()) {
      // Caso o jogador aperte a tecla "ESPAÇO", muda para a câmera principal
      case " ":
        changeToBedroomView()
        break
      // Caso o jogador aperte a tecla "1", muda a câmera para olhar para a lua
      case "1":
        telescopeCamera.lookAt(moon.position)
        lookingAt = "moon"
        break
      // Caso o jogador aperte a tecla "2", muda a câmera para olhar para júpiter
      case "2":
        telescopeCamera.lookAt(jupiter.position)
        lookingAt = "jupiter"
        break
      // Caso o jogador aperte a tecla "3", muda a câmera para olhar para o satélite
      case "3":
        telescopeCamera.lookAt(satellite.position)
        lookingAt = "satellite"
        break
      // Caso o jogador aperte a tecla "Z", adiciona ou retira o zoom da câmera
      case "Z":
        if (isZoomed) {
          telescopeCamera.position.set(
            telescope.position.x - 5,
            telescope.position.y + 10,
            telescope.position.z
          )
          break
        }

        // Define a posição da câmera de acordo com o objeto que o jogador está olhando
        if (lookingAt === "moon") {
          telescopeCamera.position.z = moon.position.z
          telescopeCamera.position.x = moon.position.x + 5
          telescopeCamera.lookAt(moon.position)
        }
        if (lookingAt === "jupiter") {
          telescopeCamera.position.x = jupiter.position.x + 20
          telescopeCamera.position.y = jupiter.position.y
          telescopeCamera.lookAt(jupiter.position)
        }
        if (lookingAt === "satellite") {
          telescopeCamera.position.z = satellite.position.z
          telescopeCamera.position.x = satellite.position.x + 10
          telescopeCamera.lookAt(satellite.position)
        }
        isZoomed = !isZoomed
    }
  })
}

// Função de transição para a câmera do telescópio
function changeToTelescopeView() {
  isTelescopeView = true

  const backDiv = document.getElementById("back-key") as HTMLDivElement
  const menuDiv = document.getElementById("telescope-menu") as HTMLDivElement

  backDiv.style.display = "flex"
  menuDiv.style.display = "flex"

  playerCamera.viewRaycaster.far = 0
}

// Função de transição para a câmera principal
function changeToBedroomView() {
  isTelescopeView = false

  const backDiv = document.getElementById("back-key") as HTMLDivElement
  const menuDiv = document.getElementById("telescope-menu") as HTMLDivElement

  backDiv.style.display = "none"
  menuDiv.style.display = "none"

  playerCamera.viewRaycaster.far = 2
}
