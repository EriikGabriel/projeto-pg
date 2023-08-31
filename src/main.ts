import {
  ArrowHelper,
  AxesHelper,
  Color,
  HemisphereLight,
  Object3D,
  Raycaster,
  Scene,
  Vector3,
} from "three"

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js"

import { Camera } from "./core/Camera"
import { Renderer } from "./core/Renderer"

import { PlayerCamera } from "./core/PlayerCamera"
import { BulbLight } from "./lights/BulbLight"
import { MoonLight } from "./lights/MoonLight"

import { Bedroom } from "./models/Bedroom"

// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

const objects: Object3D[] = []

// Create scene
const scene = new Scene()
scene.background = new Color("#080820")

// Create raycaster
const raycaster = new Raycaster(new Vector3(), new Vector3(0, 0, 1), 0, 30)
const raycasterHelper = new ArrowHelper(
  raycaster.ray.direction,
  raycaster.ray.origin,
  300,
  0xff0000
)

scene.add(raycasterHelper)

// Load scenario model
const bedroom = await Bedroom.object()
scene.add(bedroom)

// Create first person camera
const playerCamera = new PlayerCamera(mainCamera, canvas)

// Create pointer lock controls
const pointerControl = new PointerLockControls(mainCamera, document.body)
scene.add(pointerControl.getObject())

// Add axes helper
scene.add(new AxesHelper(500))

// Create hemisphere light
const hemiLight = new HemisphereLight("#29294d", "#080820", 2)
scene.add(hemiLight)

// Create a moon light
const moonLight = new MoonLight({ x: -5, y: 3, z: -3 })
scene.add(moonLight, moonLight.helper)

// Create bulb light
const bulbLight = new BulbLight({ x: 1.47, y: 0.75, z: -1.3 })
scene.add(bulbLight, bulbLight.helper)

// Load scenario model
const bedroom = await Bedroom.object()
scene.add(bedroom)

// Create first person camera
const playerCamera = new PlayerCamera(mainCamera, canvas)

// Start rendering
let previousFrameTime: number | null = null

objects.push(bedroom)

process()

// Main function to render the scene every time a request to canvas is made
function process() {
  requestAnimationFrame((t) => {
    if (previousFrameTime === null) previousFrameTime = t

    animate(t - previousFrameTime)

    renderer.autoClear = true
    renderer.render(scene, mainCamera)
    renderer.autoClear = false

    previousFrameTime = t

    pointerControl.lock()

    process()
  })
}

function animate(timeElapsed: number) {
  const timeElapsedS = timeElapsed * 0.001

  if (pointerControl.isLocked) {
    raycaster.ray.origin.copy(pointerControl.getObject().position)
    raycaster.ray.origin.y = 1

    const intersections = raycaster.intersectObjects(objects, true)
    // console.log(intersections)
    const onObject = intersections.length > 0

    const delta = timeElapsed

    if (onObject === true) {
      intersections.forEach((intersection) => {
        const object = intersection.object

        if (object.name !== "") {
          playerCamera.movementSpeed = Math.max(0, 0)
        }
      })
    }
  }

  playerCamera.update_(timeElapsedS)
  playerCamera.update_(timeElapsedS)
}
