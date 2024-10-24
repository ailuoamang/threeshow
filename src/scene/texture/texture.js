import * as THREE from 'three';
import GUI from "lil-gui";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class TextureScene {
    #gui;

    #renderer;
    #scene;
    camera;

    #geometry;
    #currentTexture;
    #leatherArmorTexture;
    #leatherDiamondPatchesTexture;
    #leatherArmorMaterial;
    #leatherDiamondPatchesMaterial;
    #cube;

    constructor(renderer) {
        this.#renderer = renderer;
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            console.log('开始加载', url, itemsLoaded, itemsTotal)
        }
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log('加载中', url, itemsLoaded, itemsTotal);
        }
        loadingManager.onLoad = () => {
            console.log('加载完成')
        }
        loadingManager.onError = (url) => {
            console.log('有错误', url)
        }

        const textureLoader = new THREE.TextureLoader(loadingManager);

        this.#leatherArmorTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_basecolor.png');
        this.#leatherArmorTexture.wrapS = THREE.RepeatWrapping;
        this.#leatherArmorTexture.wrapT = THREE.RepeatWrapping;

        this.#leatherDiamondPatchesTexture = textureLoader.load('/texture/leatherDiamondPatches/Leather_Diamond_Patches_002_basecolor.jpg');
        this.#leatherDiamondPatchesTexture.wrapS = THREE.RepeatWrapping;
        this.#leatherDiamondPatchesTexture.wrapT = THREE.RepeatWrapping;

        this.#leatherArmorMaterial = new THREE.MeshBasicMaterial({
            map: this.#leatherArmorTexture,
        })
        this.#leatherDiamondPatchesMaterial = new THREE.MeshBasicMaterial({
            map: this.#leatherDiamondPatchesTexture
        })
        console.log(this.#leatherArmorMaterial)
    }
    createScene(size) {
        //场景参数
        const params = {
            textureType: 'leatherArmor',//type起得不好，之后改一个单词
            textureRepeat: {//这两个属性只有占位符的意义了，是不是有更好的写法
                "x": 1,
                "y": 1
            },
            textureOffset: {
                "x": 0,
                "y": 0
            },
            textureRoatation: {
                'angle': 0,
                'centerX': 0,
                "centerY": 0
            }
        }

        //scene
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color("#BDC0BA");

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
        this.camera.position.set(0, 0, 20);

        //控制器
        const controls = new OrbitControls(this.camera, this.#renderer.domElement);
        controls.update();

        //球体
        this.#geometry = new THREE.CylinderGeometry(3, 3, 12, 32);
        this.#currentTexture = this.#leatherArmorTexture;
        this.#cube = new THREE.Mesh(this.#geometry, this.#leatherArmorMaterial);

        this.#scene.add(this.#cube);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cube));

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
        //纹理类型
        //啧我想把handlechnage写在下面的，符合顺序
        const handleChange = (value) => {
            console.log(value);
            console.log('gui', this.#gui)

            //重置gui
            for (let i = 0; i < this.#gui.folders.length; i++) {
                const folder = this.#gui.folders[i];
                for (let j = 0; j < folder.controllers.length; j++) {
                    const controller = folder.controllers[j];
                    if (controller.name === 'textureParam') {
                        console.log('重置属性')
                        controller.reset();
                    }
                }
            }
            //重置gui对应的属性
            this.#currentTexture.repeat.x = 1;
            this.#currentTexture.repeat.y = 1;
            this.#currentTexture.offset.x = 0;
            this.#currentTexture.offset.y = 0;

            if (value === 'leatherDiamondPatches') {
                this.#cube.material = this.#leatherDiamondPatchesMaterial;
                this.#currentTexture = this.#leatherDiamondPatchesTexture;
            } else if (value === 'leatherArmor') {
                this.#cube.material = this.#leatherArmorMaterial;
                this.#currentTexture = this.#leatherArmorTexture;
            }
        }
        this.#createController(this.#gui, 'textureType', [params, 'textureType', ['leatherArmor', 'leatherDiamondPatches']], handleChange);

        //纹理属性
        //repeat
        const folderA = this.#gui.addFolder('textureRepeat');
        this.#createController(folderA, 'textureParam', [params.textureRepeat, 'x', 1, 10, 1], (v) => { this.#currentTexture.repeat.x = v });
        this.#createController(folderA, 'textureParam', [params.textureRepeat, 'y', 1, 10, 1], (v) => { this.#currentTexture.repeat.y = v });

        //offset
        const folderB = this.#gui.addFolder('textureOffset');
        this.#createController(folderB, 'textureParam', [params.textureOffset, 'x', 0, 1, 0.1], (v) => { this.#currentTexture.offset.x = v });
        this.#createController(folderB, 'textureParam', [params.textureOffset, 'y', 0, 1, 0.1], (v) => { this.#currentTexture.offset.y = v });

        //rotation
        const folderC = this.#gui.addFolder('textureRotation');
        this.#createController(folderC, 'textureParam', [params.textureRoatation, 'angle', 0, 360, 1], (v) => { this.#currentTexture.rotation = Math.PI * 2 * (v / 360) });
        this.#createController(folderC, 'textureParam', [params.textureRoatation, 'centerX', -10, 10, 1], (v) => { this.#currentTexture.center.x = v });
        this.#createController(folderC, 'textureParam', [params.textureRoatation, 'centerY', -10, 10, 1], (v) => { this.#currentTexture.center.y = v });
    }
    disposeScene() {
        this.#geometry.dispose();
        this.#leatherArmorMaterial.dispose();
        this.#leatherDiamondPatchesMaterial.dispose();
        this.#gui.destroy();
    }
    #animate() {
        // object.rotation.x += 0.01;
        // object.rotation.y += 0.01;
        // 渲染器帧渲染场景和相机
        this.#renderer.render(this.#scene, this.camera);
    }
    //gui controller
    //啧应该用ts的，可以加点类型
    #createController(parent, controllerName, params, callback) {
        const controller = parent
            .add(...params)
            .onChange(callback)
        controller.name = controllerName;
        return controller;
    }
}