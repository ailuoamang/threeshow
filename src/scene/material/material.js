import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 这个场景使用requestAnimationFrame来实现动画，以作参考
// 打算演示几个支持灯光的材质,可能加个卡通什么的，不然写起来有点烦
// todo，这里测试再加个甜甜圈,甜甜圈回家找个贴图
// 基于现在的状况，我需要抽象出
// 包含gui控制的灯光创建类来简化代码编写
// 后期可能还会抽象一个scene身上也抽象一些gui比如fog 的清理方法，如果用强类型语言，还可以用泛型和多继承整点花活，让代码结构美观点
// 还要抽象一个object综合体：实例化它，会同时添加一个对应的gui folder,包含默认的xyz以及rotation，还有color
export default class MaterialScene {
    #renderer;
    #scene;
    camera;

    #cylinerGeometry;
    #TorusGeometry;
    #ambientOcclusionTexture;
    #baseColorTexture;
    #heightTexture;
    #metallicTexture;
    #normalTexture;
    #roughnessTexture;
    #meshStandardMaterial;
    #meshToonMaterial;

    #cylinder;
    #torus;

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

        this.#meshStandardMaterial = new THREE.MeshStandardMaterial({
            map: this.#baseColorTexture,
            aoMap: this.#ambientOcclusionTexture,
            normalMap: this.#normalTexture,
            metalnessMap: this.#metallicTexture,
            roughnessMap: this.#roughnessTexture,
        })

        this.#meshToonMaterial = new THREE.MeshToonMaterial();

    }
    createScene(size) {

        //scene
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color("#BDC0BA");

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 40);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //灯光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.#scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 100);
        pointLight.position.set(-5, 8, 8);
        this.#scene.add(pointLight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.#scene.add(pointLightHelper);


        //柱体
        this.#cylinerGeometry = new THREE.CylinderGeometry(3, 3, 12, 32);
        this.#cylinder = new THREE.Mesh(this.#cylinerGeometry, this.#meshStandardMaterial);

        this.#scene.add(this.#cylinder)

        //圆环
        this.#TorusGeometry = new THREE.TorusGeometry(8, 3, 16, 100);
        this.#torus = new THREE.Mesh(this.#TorusGeometry, this.#meshToonMaterial);
        this.#torus.position.x = -20;

        this.#scene.add(this.#torus);

        //animation
        const clock = new THREE.Clock();
        this.#animate(this.#cylinder, clock);
    }
    disposeScene() {
        this.#cylinerGeometry.dispose();
        this.#meshStandardMaterial.dispose();//话说dispose了材质会不会自动清理纹理数据呢，不会，要手动释放

        this.#TorusGeometry.dispose();
        this.#meshToonMaterial.dispose();
        //todo 清除纹理，封装成一个公共类吧

        window.cancelAnimationFrame(this.requestAnimationFrameID);
    }
    #animate(object, clock) {
        // const elapsedTime = clock.getElapsedTime();增量时间
        // object.rotation.z = elapsedTime;
        // object.rotation.x = elapsedTime;
        this.#renderer.render(this.#scene, this.camera);
        this.requestAnimationFrameID = window.requestAnimationFrame(() => this.#animate(object, clock))
    }
}
