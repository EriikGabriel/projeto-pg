import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from "three"

import { Camera } from "./core/Camera"
import { Renderer } from "./core/Renderer"

// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

// Create scene
const scene = new Scene()

// Create cube geometry and material
const geometry = new BoxGeometry()
const material = new MeshPhongMaterial({ color: 0x00ff00 })

// Create cube mesh and set position
const cube = new Mesh(geometry, material)
cube.position.z = -5
cube.position.x = 0

// Add cube to scene
scene.add(cube)

// Create directional light, set color, intensity and position
const light = new DirectionalLight(0xffffff, 1)
light.position.set(0, 4, 2)

// Add light to scene
scene.add(light)

// Main function to render the scene every time a request to canvas is made
function process() {
  renderer.render(scene, mainCamera)
  requestAnimationFrame(process)
}

process()
