import * as THREE from 'three';
import GUI from "lil-gui";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class TextureScene {
    #gui;

    #renderer;
    #scene;
    camera;

    #geometry;
    #leatherArmorMaterial;
    #leatherDiamondPatchesMaterial;
    #cube;

    constructor(renderer) {
        this.#renderer = renderer;
        const loadingManager=new THREE.LoadingManager();
        loadingManager.onStart=(url, itemsLoaded, itemsTotal)=>{
            console.log('开始加载',url, itemsLoaded, itemsTotal)
        }
        loadingManager.onProgress=(url, itemsLoaded, itemsTotal)=>{
            console.log('加载中',url, itemsLoaded, itemsTotal);
        }
        loadingManager.onLoad=()=>{
            console.log('加载完成')
        }
        loadingManager.onError=(url)=>{
            console.log('有错误',url)
        }

        const textureLoader = new THREE.TextureLoader(loadingManager);
        const leatherArmorTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_basecolor.png');
        const leatherDiamondPatchesTexture = textureLoader.load('/texture/leatherDiamondPatches/Leather_Diamond_Patches_002_basecolor.jpg');
        this.#leatherArmorMaterial = new THREE.MeshBasicMaterial({
            map: leatherArmorTexture,
        })
        this.#leatherDiamondPatchesMaterial = new THREE.MeshBasicMaterial({
            map: leatherDiamondPatchesTexture
        })
    }
    createScene(size) {
        //场景参数
        const params = {
            textureType: 'leatherArmor',//type起得不好，之后改一个单词
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
        this.#cube = new THREE.Mesh(this.#geometry, this.#leatherArmorMaterial);

        this.#scene.add(this.#cube);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cube));

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
        //纹理
        this.#gui
            .add(params, 'textureType', ['leatherArmor', 'leatherDiamondPatches'])
            .onChange(value => {
                console.log(value);
                if (value === 'leatherDiamondPatches') {
                    this.#cube.material = this.#leatherDiamondPatchesMaterial;
                } else if (value === 'leatherArmor') {
                    this.#cube.material = this.#leatherArmorMaterial;
                }
            });
    }
    disposeScene() {
        this.#geometry.dispose();
        this.#leatherArmorMaterial.dispose();
        this.#leatherDiamondPatchesMaterial.dispose();
        this.#gui.destroy();
    }
    #animate(object) {
        // object.rotation.x += 0.01;
        // object.rotation.y += 0.01;
        //渲染器帧渲染场景和相机
        this.#renderer.render(this.#scene, this.camera);
    }
}