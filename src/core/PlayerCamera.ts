import { Box3, Camera, Euler, Quaternion, Ray, Raycaster, Vector3 } from "three"

import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js"

import { clamp } from "three/src/math/MathUtils.js"

import { PlayerControls } from "./PlayerControls"

export class PlayerCamera extends FirstPersonControls {
  private camera: Camera
  private control: PlayerControls
  private rotation: Quaternion
  private translation: Vector3
  private phi: number
  private phiSpeed: number
  private theta: number
  private thetaSpeed: number
  private euler: Euler
  private headBobActive: boolean
  private headBobTimer: number
  private objects: Box3[]

  viewRaycaster: Raycaster

  constructor(
    camera: Camera,
    control: PlayerControls,
    canvas: HTMLCanvasElement
  ) {
    super(camera, canvas)

    // Define todos os valores iniciais
    this.camera = camera
    this.control = control
    this.rotation = new Quaternion()
    this.translation = new Vector3(1.5, 1, 0)
    this.phi = 0
    this.phiSpeed = 4
    this.theta = 0
    this.thetaSpeed = 4
    this.euler = new Euler(0, 0, 0, "YXZ")
    this.headBobActive = false
    this.headBobTimer = 0
    this.objects = []

    // Define o raio de visão do jogador
    this.viewRaycaster = new Raycaster()
    this.viewRaycaster.far = 2
  }

  // Função que atualiza todos os parâmetros da câmera
  update_(timeElapsedS: number) {
    this.updateRotation()
    this.updateCamera()
    this.updateTranslation(timeElapsedS)
    this.updateHeadBob(timeElapsedS)
    this.control.update()

    this.lookSpeed = 0.05
    this.movementSpeed = 0.1
  }

  // Função que atualiza a posição e rotação da câmera
  updateCamera() {
    this.camera.quaternion.copy(this.rotation)
    this.camera.position.copy(this.translation)
    this.camera.position.y += Math.sin(this.headBobTimer * 0.1) * 0.1

    const forward = new Vector3(0, 0, -1)
    forward.applyQuaternion(this.rotation)

    const dir = forward.clone()

    forward.multiplyScalar(100)
    forward.add(this.translation)

    let closest = forward
    const result = new Vector3()
    const ray = new Ray(this.translation, dir)
    for (let i = 0; i < this.objects.length; ++i) {
      if (ray.intersectBox(this.objects[i], result)) {
        if (result.distanceTo(ray.origin) < closest.distanceTo(ray.origin)) {
          closest = result.clone()
        }
      }
    }

    this.camera.lookAt(closest)
  }

  // Função que atualiza o balanço da cabeça
  updateHeadBob(timeElapsedS: number) {
    if (this.headBobActive) {
      const wavelength = Math.PI
      const nextStep =
        1 + Math.floor(((this.headBobTimer + 0.000001) * 0.5) / wavelength)
      const nextStepTime = (nextStep * wavelength) / 0.5
      this.headBobTimer = Math.min(
        this.headBobTimer + timeElapsedS,
        nextStepTime
      )

      if (this.headBobTimer == nextStepTime) {
        this.headBobActive = false
      }
    }
  }

  // Função que atualiza a posição do jogador no mundo (movimentação)
  updateTranslation(timeElapsedS: number) {
    const forwardVelocity =
      (this.control.key("KeyW") ? 1 : 0) + (this.control.key("KeyS") ? -1 : 0)
    const strafeVelocity =
      (this.control.key("KeyA") ? 1 : 0) + (this.control.key("KeyD") ? -1 : 0)

    const qx = new Quaternion()
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi)

    // Movimentação para frontal e traseira
    const forward = new Vector3(0, 0, -this.movementSpeed)
    forward.applyQuaternion(qx)
    forward.multiplyScalar(forwardVelocity * timeElapsedS * 10)

    // Movimentação lateral
    const left = new Vector3(-this.movementSpeed, 0, 0)
    left.applyQuaternion(qx)
    left.multiplyScalar(strafeVelocity * timeElapsedS * 10)

    this.translation.add(forward)
    this.translation.add(left)

    if (forwardVelocity != 0 || strafeVelocity != 0) {
      // Para balançar a cabeça -- this.headBobActive = true
    }
  }

  // Função que atualiza a rotação da câmera
  updateRotation() {
    const xh = this.control.current.mouseXDelta / window.innerWidth
    const yh = this.control.current.mouseYDelta / window.innerHeight

    this.euler.setFromQuaternion(this.camera.quaternion)

    this.euler.y -= xh * 0.002 * this.phiSpeed
    this.euler.x -= yh * 0.002 * this.thetaSpeed

    const minPolarAngle = 0
    const maxPolarAngle = Math.PI

    // Limita o ângulo de rotação da câmera
    this.euler.x = Math.max(
      Math.PI / 2 - maxPolarAngle,
      Math.min(Math.PI / 2 - minPolarAngle, this.euler.x)
    )

    // Atualiza os valores de phi e theta
    // phi: rotação horizontal
    // theta: rotação vertical
    this.phi += -xh * this.phiSpeed
    this.theta = clamp(
      this.theta + -yh * this.thetaSpeed,
      -Math.PI / 3,
      Math.PI / 3
    )

    const qx = new Quaternion()
    qx.setFromAxisAngle(new Vector3(0, 1, 0), this.phi)
    const qz = new Quaternion()
    qz.setFromAxisAngle(new Vector3(1, 0, 0), this.theta)

    const q = new Quaternion()
    q.multiply(qx)
    q.multiply(qz)

    this.rotation.copy(q)
    this.camera.quaternion.setFromEuler(this.euler)
  }
}
