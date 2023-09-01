import { Color, HemisphereLight, Object3D, Scene, Vector2 } from "three"

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js"

import { Camera } from "./core/Camera"
import { Renderer } from "./core/Renderer"

import { PlayerCamera } from "./core/PlayerCamera"
import { BulbLight } from "./lights/BulbLight"
import { MoonLight } from "./lights/MoonLight"

import { PlayerControls } from "./core/PlayerControls"
import { JupiterLight } from "./lights/JupiterLight"
import { Bedroom } from "./models/Bedroom"
import { Jupiter } from "./models/Jupiter/Jupiter"
import { Moon } from "./models/Moon"
import { Satellite } from "./models/Satellite"
import { Telescope } from "./models/Telescope"

// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

// Set camera position
mainCamera.position.set(1.5, 1, 0)
mainCamera.rotation.set(0, 1, 0)

// Create telescope camera

const objects: Object3D[] = []
const interactiveObjects: Object3D[] = []

let isInteracting = false
let isTelescopeView = false

// Create scene
const scene = new Scene()
scene.background = new Color("#080820")

// Create player controls
const playerControls = new PlayerControls(canvas)

// Create first person camera
const playerCamera = new PlayerCamera(mainCamera, playerControls, canvas)

// Create pointer lock controls
const pointerControl = new PointerLockControls(mainCamera, document.body)
scene.add(pointerControl.getObject())

// Create hemisphere light
const hemiLight = new HemisphereLight("#29294d", "#080820", 2)
scene.add(hemiLight)

// Load scenario model
const bedroom = await Bedroom.object()
scene.add(bedroom)

// Create bulb light
const bulbLight = new BulbLight({ x: 1.47, y: 0.75, z: -1.3 })
scene.add(bulbLight)

// Add moon object
const moon = new Moon()
moon.position.set(-30, 10, -3)
scene.add(moon)

// Create a moon light
const moonLight = new MoonLight({ x: -30, y: 10, z: -3 })
scene.add(moonLight)

// Add satellite object
const satellite = new Satellite().getMesh()
satellite.scale.set(0.1, 0.1, 0.1)
satellite.position.set(-30, 10, 5)
satellite.rotation.x = Math.PI / 2
scene.add(satellite)

// Add Jupiter
const jupiter = new Jupiter()
jupiter.position.set(-60, 25, 5)

scene.add(jupiter)

// Create jupiter light
const jupiterLight = new JupiterLight({ x: -60, y: 25, z: 5 })
scene.add(jupiterLight)

const telescope = await Telescope.object()
scene.add(telescope)

const telescopeCamera = new Camera()
telescopeCamera.position.set(
  telescope.position.x - 5,
  telescope.position.y + 3,
  telescope.position.z
)

telescopeCamera.lookAt(moon.position)

// Start rendering
let previousFrameTime: number | null = null

objects.push(bedroom)
interactiveObjects.push(bulbLight, telescope)

process()

// Main function to render the scene every time a request to canvas is made
function process() {
  requestAnimationFrame((t) => {
    canvas.addEventListener("click", () => pointerControl.lock())

    if (previousFrameTime === null) previousFrameTime = t

    if (pointerControl.isLocked) animate(t - previousFrameTime)

    previousFrameTime = t

    render()
    process()
  })
}

// Render the scene
function render() {
  renderer.autoClear = true
  renderer.render(scene, isTelescopeView ? telescopeCamera : mainCamera)
  renderer.autoClear = false
}

// Function to animate the scene
function animate(timeElapsed: number) {
  const timeElapsedS = timeElapsed * 0.001

  jupiter.rotateY(0.005)

  playerView()

  if (isTelescopeView) telescopeView()

  playerCamera.update_(timeElapsedS)
}

function playerView() {
  playerCamera.viewRaycaster.setFromCamera(
    new Vector2(0, 0),
    pointerControl.getObject()
  )

  const intersections = playerCamera.viewRaycaster.intersectObjects(
    interactiveObjects,
    true
  )

  const interactDiv = document.getElementById("interact-key") as HTMLDivElement
  const interactText = document.querySelector(
    "#interact-key p"
  ) as HTMLParagraphElement

  const onObject = intersections.length > 0

  if (onObject) {
    intersections.forEach((intersection) => {
      const object = intersection.object.parent?.parent

      interactText.textContent = `Interagir com ${object?.name}`
      interactDiv.style.display = "flex"

      addEventListener("click", () => {
        if (!isInteracting) {
          switch (object?.name) {
            case "lâmpada":
              break
            case "telescópio":
              changeToTelescopeView()
              break
          }
        }
      })
    })
  } else {
    interactDiv.style.display = "none"
  }
}

function telescopeView() {
  addEventListener("keydown", (e) => {
    if (e.key === " ") changeToBedroomView()
  })
}

function changeToTelescopeView() {
  isInteracting = true
  isTelescopeView = true

  const backDiv = document.getElementById("back-key") as HTMLDivElement
  backDiv.style.display = "flex"

  playerCamera.viewRaycaster.far = 0
}

function changeToBedroomView() {
  isTelescopeView = false
  isInteracting = false

  const backDiv = document.getElementById("back-key") as HTMLDivElement
  backDiv.style.display = "none"

  playerCamera.viewRaycaster.far = 2
}
