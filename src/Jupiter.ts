import {
    SphereGeometry,
    DirectionalLight,
    Mesh,
    MeshPhongMaterial,
    Scene,
  } from "three";
  
import { Camera } from "./core/Camera";
import { Renderer } from "./core/Renderer";
import { TextureLoader } from "three";

class Jupiter {
canvas: HTMLCanvasElement;
renderer: Renderer;
mainCamera: Camera;
scene: Scene;
sphereMesh: Mesh | null; // Declare the property

constructor() {
    this.canvas = document.getElementById("app") as HTMLCanvasElement;
    this.renderer = new Renderer(this.canvas);
    this.mainCamera = new Camera();
    this.scene = new Scene();
    this.sphereMesh = null; // Initialize the property

    this.init();
}

init() {
    this.createSphere();
    this.createLight();
    this.render();
}

createSphere() {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("jupiter.jpg");

    const geometry = new SphereGeometry();
    const material = new MeshPhongMaterial({ map: texture });

    this.sphereMesh = new Mesh(geometry, material);
    this.sphereMesh.position.z = -5;
    this.sphereMesh.position.x = 0;

    this.scene.add(this.sphereMesh);
}

createLight() {
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);
    this.scene.add(light);
}

render() {
    this.renderer.render(this.scene, this.mainCamera);
    requestAnimationFrame(this.render.bind(this));

    if (this.sphereMesh) {
    this.sphereMesh.rotateY(0.01);
    this.sphereMesh.rotateX(0.01);
    this.sphereMesh.rotateZ(0.01);
    }
}
}

// Only instantiate when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const jupiter = new Jupiter();
});
  