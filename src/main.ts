
import THREE, {
  CircleGeometry,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from "three"

import { Camera } from "./core/Camera"
import { Renderer } from "./core/Renderer"
import { Satellite } from "./core/satelite";


// Get main canvas element
const canvas = document.getElementById("app") as HTMLCanvasElement

// Create renderer and main camera
const renderer = new Renderer(canvas)
const mainCamera = new Camera()

// Create scene
const scene = new Scene()

// Create cube geometry and material
const geometry = new CircleGeometry()
const geometry2 = new BoxGeometry()

const material = new MeshPhongMaterial({ color: 0xffffff })

// Create cube mesh and set position
const circle = new Mesh(geometry, material)
const box = new Mesh(geometry2, material)
circle.position.z = -5
circle.position.x = 0

box.position.z = -4
box.position.x = 10


// Add cube to scene
//scene.add(box)
//scene.add(circle)
  

//add satelite to scene

const satellite = new Satellite();

satellite.getMesh().position.z = -4
satellite.getMesh().position.x = -1
scene.add(satellite.getMesh());

// Create directional light, set color, intensity and position
const light = new DirectionalLight(0xffffff, 1)
light.position.set(0, 4, 2)

// Add light to scene
scene.add(light)

// Main function to render the scene every time a request to canvas is made
let angle = 0
mainCamera.position.z = -5;
function process() {
  
  mainCamera.position.x = 12 * Math.sin(angle);
  mainCamera.position.z = 12 * Math.cos(angle);
  mainCamera.lookAt(satellite.getMesh().position);  // Faz a câmera sempre olhar para o cubo

  angle += 0.01;  // Incrementa o ângulo para a rotação
  renderer.render(scene, mainCamera)
  requestAnimationFrame(process)
}


process()
