import {
  SphereGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from "three"

import { Camera } from "./core/Camera"
import { Renderer } from "./core/Renderer"
import { TextureLoader } from "three"

// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

// Create scene
const scene = new Scene()

// load a texture
const textureLoader = new TextureLoader();
const texture = textureLoader.load("jupiter.jpg");

// Create cube geometry and material
const geometry = new SphereGeometry()
const material = new MeshPhongMaterial({ map: texture })

// Create cube mesh and set position
const sphere = new Mesh(geometry, material)
sphere.position.z = -5
sphere.position.x = 0

// Add cube to scene
scene.add(sphere)

// Create directional light, set color, intensity and position
const light = new DirectionalLight(0xffffff, 1)
light.position.set(0, 4, 2)

// Add light to scene
scene.add(light)

// Main function to render the scene every time a request to canvas is made
function process() {
  renderer.render(scene, mainCamera)
  requestAnimationFrame(process)
  sphere.rotateY(0.3)
  sphere.rotateX(0.1)
  sphere.rotateZ(0.1)
}

process()
