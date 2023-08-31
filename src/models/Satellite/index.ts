import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from "three"

export class Satellite {
  private satelliteGroup: Group

  constructor() {
    this.satelliteGroup = new Group()

    // Shader do corpo, shader cria um efeito metálico para o corpo do satélite.
    const bodyShader = {
      vertexShader:
        //Calculamos a normal que sera utilizada para calcular o ângulo entre a superfície e a fonte de luz
        `varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
      fragmentShader:
        //calculamos a intensidade da luz refletida utilizando o produto escalar entre a normal (vNormal) e uma direção de luz.
        //Elevamos isso a uma potência alta para acentuar a diferença entre áreas iluminadas e sombreadas.
        // Finalmente, misturamos a cor base do corpo (cinza médio) com a intensidade calculada para dar o efeito metálico.
        `varying vec3 vNormal;
          void main() {
            float intensity = pow(dot(vNormal, vec3(0.0, 1.0, 0.0)), 4.0);
            gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0) + intensity * vec4(0.5, 0.5, 0.5, 1.0);
          }`,
    }

    // Shader da antena, shader aplica um gradiente de cor à antena.
    const antennaShader = {
      // Passamos as coordenadas de textura ('uv')
      vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // Usamos as coordenadas de textura (vUv) para criar um gradiente vertical.
      // A cor na parte inferior da antena é mais escura (vec4(0.2, 0.2, 0.2, 1.0)) e a cor na parte superior é mais clara (vec4(0.6, 0.6, 0.6, 1.0)).
      fragmentShader: `
        varying vec2 vUv;
        void main() {
            gl_FragColor = mix(vec4(0.2, 0.2, 0.2, 1.0), vec4(0.6, 0.6, 0.6, 1.0), vUv.y);
        }
      `,
    }

    // Shader para os braços, shader aplica uma cor sólida aos braços de conexão.
    const armShader = {
      // Calculado a posição dos vertices
      vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      // Atribuímos uma cor para os pixels do vértice
      fragmentShader: `
        void main() {
            gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0); // dark color
        }
      `,
    }

    // Shader para os painéis, cria um efeito de reflexão nas células solares dos painéis.
    const panelShader = {
      // Calculo da normal
      vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // calculamos a reflexão da luz com base na normal.
      // Quanto mais próxima a normal estiver da direção de reflexão, mais intensa é a reflexão. Utilizamos essa reflexão para misturar duas cores:
      // uma mais escura (vec4(0.0, 0.2, 0.1, 1.0)) e outra mais clara (vec4(0.0, 0.5, 0.25, 1.0)).
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float reflection = pow(dot(vNormal, vec3(0.0, 1.0, 0.0)), 2.0);
            gl_FragColor = mix(vec4(0.0, 0.2, 0.1, 1.0), vec4(0.0, 0.5, 0.25, 1.0), reflection);
        }
      `,
    }

    // Criando os materiais de acordo com os shaders criados
    const bodyMaterial = new ShaderMaterial({
      vertexShader: bodyShader.vertexShader,
      fragmentShader: bodyShader.fragmentShader,
    })

    const antennaMaterial = new ShaderMaterial({
      vertexShader: antennaShader.vertexShader,
      fragmentShader: antennaShader.fragmentShader,
    })

    const armMaterial = new ShaderMaterial({
      vertexShader: armShader.vertexShader,
      fragmentShader: armShader.fragmentShader,
    })

    const panelMaterial = new ShaderMaterial({
      vertexShader: panelShader.vertexShader,
      fragmentShader: panelShader.fragmentShader,
    })

    // Criar corpo principal do satélite
    const bodyGeometry = new CylinderGeometry(2, 2, 6, 32)
    const body = new Mesh(bodyGeometry, bodyMaterial)

    // Criar painéis solares
    const panelGeometry = new PlaneGeometry(2, 8)
    const leftPanel = new Mesh(panelGeometry, panelMaterial)
    leftPanel.position.set(-5, 0, 0)
    leftPanel.rotation.y = Math.PI / 2

    const rightPanel = new Mesh(panelGeometry, panelMaterial)
    rightPanel.position.set(5, 0, 0)
    rightPanel.rotation.y = -Math.PI / 2

    // Criar antena
    const antennaGeometry = new CylinderGeometry(0.5, 0.5, 4, 32)
    const antenna = new Mesh(antennaGeometry, antennaMaterial)
    antenna.position.set(0, 5, 0)
    antenna.rotation.x = Math.PI / 2

    //ligar a antena ao corpo principal do satélite

    const connectorGeometry = new CylinderGeometry(0.4, 0.9, 2, 32)
    const connector = new Mesh(connectorGeometry, armMaterial)
    connector.position.set(0, 3, 0) // Positioned between the body and the antenna

    //ligar os painéis ao corpo principal do satélite

    const armGeometry = new BoxGeometry(5.5, 0.5, 2)
    const leftArm = new Mesh(armGeometry, armMaterial)
    leftArm.position.set(-2, 0, 0)
    const rightArm = new Mesh(armGeometry, armMaterial)
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
