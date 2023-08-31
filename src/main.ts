import { AxesHelper, Color, HemisphereLight, Scene } from "three"

import { Camera } from "./core/Camera"
import { Controls } from "./core/Controls"
import { Renderer } from "./core/Renderer"

import { BulbLight } from "./lights/BulbLight"
import { MoonLight } from "./lights/MoonLight"
import { Bedroom } from "./models/Bedroom"

// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

mainCamera.position.set(1, 2, 1)

// Create scene
const scene = new Scene()
scene.background = new Color("#080820")

// Add axes helper
scene.add(new AxesHelper(500))

// Orbit Control
const orbitControl = new Controls(mainCamera, renderer.domElement)

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

process()

// Main function to render the scene every time a request to canvas is made
function process() {
  renderer.render(scene, mainCamera)
  orbitControl.update()

  requestAnimationFrame(process)
}
