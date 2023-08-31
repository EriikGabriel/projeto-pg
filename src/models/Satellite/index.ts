import * as THREE from "three"

export class Satellite {
  private satelliteGroup: THREE.Group

  constructor() {
    this.satelliteGroup = new THREE.Group()

    // Shader do corpo, shader cria um efeito metálico para o corpo do satélite.
    const bodyShader = {
      vertexShader: `varying vec3 vNormal;
             void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
      fragmentShader: `varying vec3 vNormal;
             void main() {
                float intensity = pow(dot(vNormal, vec3(0.0, 1.0, 0.0)), 4.0);
                gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0) + intensity * vec4(0.5, 0.5, 0.5, 1.0);
                }`,
    }

    //Shader da atena, shader aplica um gradiente de cor à antena.
    const antennaShader = {
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                varying vec2 vUv;
                void main() {
                    gl_FragColor = mix(vec4(0.2, 0.2, 0.2, 1.0), vec4(0.6, 0.6, 0.6, 1.0), vUv.y);
                }
            `,
    }

    // Shader para os braços, shader aplica uma cor sólida aos braços de conexão.
    const armShader = {
      vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                void main() {
                    gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0); // dark color
                }
            `,
    }

    // Shader para os paineis, cria um efeito de reflexão nas células solares dos painéis.
    const panelShader = {
      vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float reflection = pow(dot(vNormal, vec3(0.0, 1.0, 0.0)), 2.0);
                    gl_FragColor = mix(vec4(0.0, 0.2, 0.1, 1.0), vec4(0.0, 0.5, 0.25, 1.0), reflection);
                }
            `,
    }

    const bodyMaterial = new THREE.ShaderMaterial({
      vertexShader: bodyShader.vertexShader,
      fragmentShader: bodyShader.fragmentShader,
    })

    const antennaMaterial = new THREE.ShaderMaterial({
      vertexShader: antennaShader.vertexShader,
      fragmentShader: antennaShader.fragmentShader,
    })

    const armMaterial = new THREE.ShaderMaterial({
      vertexShader: armShader.vertexShader,
      fragmentShader: armShader.fragmentShader,
    })

    const panelMaterial = new THREE.ShaderMaterial({
      vertexShader: panelShader.vertexShader,
      fragmentShader: panelShader.fragmentShader,
    })

    // Criar corpo principal do satélite
    const bodyGeometry = new THREE.CylinderGeometry(2, 2, 6, 32)
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)

    // Criar painéis solares
    const panelGeometry = new THREE.PlaneGeometry(2, 8)
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    leftPanel.position.set(-5, 0, 0)
    leftPanel.rotation.y = Math.PI / 2

    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    rightPanel.position.set(5, 0, 0)
    rightPanel.rotation.y = -Math.PI / 2

    // Criar antena
    const antennaGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32)
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial)
    antenna.position.set(0, 5, 0)
    antenna.rotation.x = Math.PI / 2

    //ligar a antena ao corpo principal do satélite

    const connectorGeometry = new THREE.CylinderGeometry(0.4, 0.9, 2, 32)
    const connector = new THREE.Mesh(connectorGeometry, armMaterial)
    connector.position.set(0, 3, 0) // Positioned between the body and the antenna

    //ligar os paineis ao corpo principal do satélite

    const armGeometry = new THREE.BoxGeometry(5.5, 0.5, 2)
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-2, 0, 0)
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(2, 0, 0)

    // Adicionar todos os componentes ao grupo do satélite
    this.satelliteGroup.add(body)
    this.satelliteGroup.add(leftPanel)
    this.satelliteGroup.add(rightPanel)
    this.satelliteGroup.add(antenna)
    this.satelliteGroup.add(connector)
    this.satelliteGroup.add(rightArm)
    this.satelliteGroup.add(leftArm)
  }

  getMesh(): THREE.Group {
    return this.satelliteGroup
  }
}
