import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 这个场景使用requestAnimationFrame来实现动画，以作参考
// 打算演示几个支持灯光的材质,可能加个卡通什么的，不然写起来有点烦
// todo，这里测试再加个甜甜圈
export default class MaterialScene {
    #renderer;
    #scene;
    camera;

    #geometry;
    #ambientOcclusionTexture;
    #baseColorTexture;
    #heightTexture;
    #metallicTexture;
    #normalTexture;
    #roughnessTexture;
    #material;
    #cylinder;

    requestAnimationFrameID;
    constructor(render) {
        this.#renderer = render;

        const textureLoader = new THREE.TextureLoader();
        this.#ambientOcclusionTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_ambientOcclusion.png');
        this.#baseColorTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_basecolor.png');
        // this.#heightTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_height.png');
        this.#metallicTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_metallic.png');
        this.#normalTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_normal.png');
        this.#roughnessTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_roughness.png');

        this.#material = new THREE.MeshStandardMaterial({
            map: this.#baseColorTexture,
            aoMap: this.#ambientOcclusionTexture,
            normalMap: this.#normalTexture,
            metalnessMap: this.#metallicTexture,
            roughnessMap: this.#roughnessTexture,
        })
        // this.#material = new THREE.MeshLambertMaterial()
    }
    createScene(size) {

        //scene
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color("#BDC0BA");

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 20);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.#scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 50);
        pointLight.position.set(2, 6, 8);
        this.#scene.add(pointLight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.#scene.add(pointLightHelper);


        //柱体
        this.#geometry = new THREE.CylinderGeometry(3, 3, 12, 32);
        this.#cylinder = new THREE.Mesh(this.#geometry, this.#material);

        this.#scene.add(this.#cylinder)

        const clock = new THREE.Clock();
        this.#animate(this.#cylinder, clock);


    }
    disposeScene() {
        this.#geometry.dispose();
        this.#material.dispose();//话说dispose了材质会不会自动清理纹理数据呢
        window.cancelAnimationFrame(this.requestAnimationFrameID);
    }
    #animate(object, clock) {
        // const elapsedTime = clock.getElapsedTime();
        // object.rotation.z = elapsedTime;
        // object.rotation.x = elapsedTime;
        this.#renderer.render(this.#scene, this.camera);
        this.requestAnimationFrameID = window.requestAnimationFrame(() => this.#animate(object, clock))
    }

}
