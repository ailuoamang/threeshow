import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default class ParticleScene {
    #renderer;
    #scene;
    camera;

    gui;

    #boxGeometry;
    #boxMaterial;
    #box;

    constructor(render) {
        this.#renderer = render;
    }

    createScene(size) {
        //scene
        this.#scene = new THREE.Scene();

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 6);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //testbox
        this.#boxGeometry=new THREE.BoxGeometry(2,2,2);
        this.#boxMaterial=new THREE.MeshBasicMaterial();
        this.#box=new THREE.Mesh(this.#boxGeometry,this.#boxMaterial);
        this.#scene.add(this.#box);

        this.#renderer.setAnimationLoop(() => this.#animate())

        //gui
        this.gui = new GUI({ container: document.getElementById('pannel') });
    }
    disposeScene(){
        console.log('清除');
        this.#boxGeometry.dispose();
        this.#boxMaterial.dispose();
    }
    #animate(){
        this.#renderer.render(this.#scene, this.camera);
    }
}