import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//这里没有设置render.clearColor 来增加沉浸感
export default class HauntedHouse {
  #renderer;
  #scene;
  camera;

  #orbitControl;

  #planeGeometry;
  #planeMaterial;
  #plane;

  #house;
  #walls;
  #roof;
  #door;

  #ghost1;
  #ghost2;
  #ghost3;

  constructor(render) {
    this.#renderer = render;
  }
  createScene(size) {
    console.log(99)
    this.#scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    const doorColorTexture = textureLoader.load('/texture/door/color.jpg');
    const doorAlphaTexture = textureLoader.load('/texture/door/alpha.jpg');
    const doorAmbientOcclusionTexture = textureLoader.load('/texture/door/ambientOcclusion.jpg');
    const doorHeightTexture = textureLoader.load('/texture/door/height.jpg');
    const doorNormalTexture = textureLoader.load('/texture/door/normal.jpg');
    const doorMetalnessTexture = textureLoader.load('/texture/door/metalness.jpg');
    const doorRoughnessTexture = textureLoader.load('/texture/door/roughness.jpg');

    const bricksColorTexture = textureLoader.load('/texture/bricks/color.jpg');
    const bricksAmbientOcclusionTexture = textureLoader.load('/texture/bricks/ambientOcclusion.jpg');
    const bricksNormalTexture = textureLoader.load('/texture/bricks/normal.jpg');
    const bricksRoughnessTexture = textureLoader.load('/texture/bricks/roughness.jpg');

    const grassColorTexture = textureLoader.load('/texture/grass/color.jpg');
    const grassAmbientOcclusionTexture = textureLoader.load('/texture/grass/ambientOcclusion.jpg');
    const grassNormalTexture = textureLoader.load('/texture/grass/normal.jpg');
    const grassRoughnessTexture = textureLoader.load('/texture/grass/roughness.jpg');

    grassColorTexture.repeat.set(8, 8);
    grassAmbientOcclusionTexture.repeat.set(8, 8);
    grassNormalTexture.repeat.set(8, 8);
    grassRoughnessTexture.repeat.set(8, 8);

    grassColorTexture.wrapS = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
    grassNormalTexture.wrapS = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

    grassColorTexture.wrapT = THREE.RepeatWrapping;
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
    grassNormalTexture.wrapT = THREE.RepeatWrapping;
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

    this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
    this.camera.position.set(4, 2, 5);

    this.#orbitControl = new OrbitControls(this.camera, this.#renderer.domElement);
    this.#orbitControl.update();

    //housegroup
    this.#house = new THREE.Group();
    this.#scene.add(this.#house);

    //wall
    this.#walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
      })
    )
    this.#walls.castShadow = true//物体是否被渲染成阴影贴图
    this.#walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(this.#walls.geometry.attributes.uv.array, 2))
    this.#walls.position.y = 1.25;
    this.#house.add(this.#walls);

    this.#roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({ color: '#b35f45' })
    )
    this.#roof.rotation.y = Math.PI * 0.25;
    this.#roof.position.y = 2.5 + 0.5;
    this.#house.add(this.#roof);

    //door
    this.#door = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,//need transparent
        aoMap: doorAmbientOcclusionTexture,//need uv2  模拟环境光遮蔽贴图
        displacementMap: doorHeightTexture,//need more vertices and displacementScale
        // wireframe:true
        displacementScale: 0.1,//位移倍数
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
      })
    )
    this.#door.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(this.#door.geometry.attributes.uv.array, 2)
    )
    this.#door.position.y = 1;
    this.#door.position.z = 2 + 0.01;
    this.#house.add(this.#door);

    //bursh
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
    const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

    const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush1.castShadow = true
    bush1.scale.set(0.5, 0.5, 0.5);
    bush1.position.set(0.8, 0.2, 2.1);

    const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush2.castShadow = true
    bush2.scale.set(0.25, 0.25, 0.25);
    bush2.position.set(1.4, 0.1, 2.1);

    const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush3.castShadow = true
    bush3.scale.set(0.25, 0.25, 0.25);
    bush3.position.set(-1, 0.1, 2.3);

    const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
    bush4.scale.set(0.15, 0.15, 0.15);
    bush4.position.set(-1, 0.01, 2.6);

    this.#house.add(bush1, bush2, bush3, bush4);

    //graves
    const graves = new THREE.Group();
    this.#scene.add(graves);

    const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
    const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;//0-360度
      const radius = 3 + Math.random() * 6//3-9的半径区间
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const grave = new THREE.Mesh(graveGeometry, graveMaterial);
      grave.position.set(x, 0.4, z)
      grave.rotation.y = (Math.random() - 0.5) * 0.4;//[-0.2,0.2]
      grave.rotation.z = (Math.random() - 0.5) * 0.4
      grave.castShadow = true
      graves.add(grave)
    }

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
      })
    )
    floor.receiveShadow = true
    floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
    floor.rotation.x = - Math.PI * 0.5
    floor.position.y = 0
    this.#scene.add(floor);

    //this.#ghosts
    this.#ghost1 = new THREE.PointLight('#ff00ff', 3, 3)
    this.#ghost1.castShadow = true
    this.#ghost1.shadow.mapSize.width = 256
    this.#ghost1.shadow.mapSize.height = 256
    this.#ghost1.shadow.camera.far = 7
    this.#scene.add(this.#ghost1)

    this.#ghost2 = new THREE.PointLight('#00ffff', 3, 3)
    this.#ghost2.castShadow = true
    this.#ghost2.shadow.mapSize.width = 256
    this.#ghost2.shadow.mapSize.height = 256
    this.#ghost2.shadow.camera.far = 7
    this.#scene.add(this.#ghost2)

    this.#ghost3 = new THREE.PointLight('#ff7800', 3, 3)
    this.#ghost3.castShadow = true
    this.#ghost3.shadow.mapSize.width = 256
    this.#ghost3.shadow.mapSize.height = 256
    this.#ghost3.shadow.camera.far = 7
    this.#scene.add(this.#ghost3)

    //light
    const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12); // soft white light
    this.#scene.add(ambientLight);
    const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.5)
    moonLight.castShadow = true
    moonLight.shadow.mapSize.width = 256
    moonLight.shadow.mapSize.height = 256
    moonLight.shadow.camera.far = 15
    moonLight.position.set(4, 5, - 2)
    this.#scene.add(moonLight)

    //door light
    const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
    doorLight.castShadow = true
    doorLight.shadow.mapSize.width = 256
    doorLight.shadow.mapSize.height = 256
    doorLight.shadow.camera.far = 7
    doorLight.position.set(0, 2.2, 2.7);
    this.#house.add(doorLight)


    const fog = new THREE.Fog('#262837', 1, 15)
    this.#scene.fog = fog;

    const clock = new THREE.Clock()
    this.#renderer.setAnimationLoop(() => this.#animate(clock))
  }
  disposeScene() {
  }
  #animate(clock) {
    const elapsedTime = clock.getElapsedTime()

    // Ghosts
    const ghost1Angle = elapsedTime * 0.5
    this.#ghost1.position.x = Math.cos(ghost1Angle) * 4
    this.#ghost1.position.z = Math.sin(ghost1Angle) * 4
    this.#ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    this.#ghost2.position.x = Math.cos(ghost2Angle) * 5
    this.#ghost2.position.z = Math.sin(ghost2Angle) * 5
    this.#ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    this.#ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    this.#ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    this.#ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    //渲染器帧渲染场景和相机
    this.#renderer.render(this.#scene, this.camera);
  }
}