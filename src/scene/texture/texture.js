import * as THREE from 'three';
import GUI from "lil-gui";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class TextureScene {
    #renderer;
    #scene;
    camera;

    #textureLoader;

    #geometry;
    #material;
    #cube;
    
    constructor(renderer) {
        this.#renderer = renderer;
        this.#textureLoader=new THREE.TextureLoader();
        const leatherArmorTexture=this.#textureLoader.load('/texture/leatherArmor/Leather_Armor_003_basecolor.png')
        this.#material=new THREE.MeshBasicMaterial({
            map:leatherArmorTexture,
        })
    }
    createScene(size) {
        //场景参数
        const params = {
        }

        //scene
        this.#scene=new THREE.Scene();
        this.#scene.background=new THREE.Color("#BDC0BA");

        //相机
        this.camera=new THREE.PerspectiveCamera(75,size.width/size.height,0.1,100)
        this.camera.position.set(0,0,20);

        //控制器
        const controls=new OrbitControls(this.camera,this.#renderer.domElement);
        controls.update();

        //球体
        this.#geometry=new THREE.SphereGeometry( 10, 32, 16 ); 
        this.#cube=new THREE.Mesh(this.#geometry,this.#material);

        this.#scene.add(this.#cube);

        this.#renderer.setAnimationLoop(()=>this.#animate(this.#cube));
    }
    disposeScene() {
        this.#geometry.dispose();
        this.#material.dispose();
    }
    #animate(object) {
        // object.rotation.x += 0.01;
        // object.rotation.y += 0.01;
        //渲染器帧渲染场景和相机
        this.#renderer.render(this.#scene,this.camera);
    }

    #loadTexture(){
        //todo
    }
}