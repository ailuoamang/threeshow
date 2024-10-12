import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 这个场景使用requestAnimationFrame来实现动画，以作参考
export default class MaterialScene {
    #renderer;
    #scene;
    camera;

    #geometry;
    #leatherArmorTexture;
    #material;
    #cylinder;

    requestAnimationFrameID;
    constructor(render) {
        this.#renderer = render;

        const textureLoader = new THREE.TextureLoader();
        this.#leatherArmorTexture = textureLoader.load('/texture/leatherArmor/Leather_Armor_003_basecolor.png');

        this.#material = new THREE.MeshBasicMaterial({
            map: this.#leatherArmorTexture
        })
    }
    createScene(size) {

        //scene
        this.#scene = new THREE.Scene();

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 20);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //柱体
        this.#geometry = new THREE.CylinderGeometry(3, 3, 12, 32);
        this.#cylinder = new THREE.Mesh(this.#geometry, this.#material);

        this.#scene.add(this.#cylinder)

        const clock=new THREE.Clock();
        this.#animate(this.#cylinder,clock);
        

    }
    disposeScene(){
        this.#geometry.dispose();
        this.#material.dispose();//话说dispose了材质会不会影响纹理数据呢
        window.cancelAnimationFrame(this.requestAnimationFrameID);
    }
    #animate(object,clock){
        // console.log(this)
        const elapsedTime=clock.getElapsedTime();
        // console.log(elapsedTime)
        object.rotation.y=elapsedTime;
        this.#renderer.render(this.#scene,this.camera);
        this.requestAnimationFrameID=window.requestAnimationFrame(()=>this.#animate(object,clock))
    }

}
