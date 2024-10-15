import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

//其实这里我可以抽象一个scene父类了
export default class ThreedTextScene {
    #renderer;
    #scene;
    camera;

    #gui;

    #textGeometry;
    #textMaterial;
    #text;


    constructor(render) {
        this.#renderer = render;
        const fontLoader = new FontLoader();
        const font = fontLoader.load(
            '/font/helvetiker_regular.typeface.json',
            (font) => {
                console.log('加载字体', font);
                this.#textGeometry = new TextGeometry('Space Dandy', {
                    font: font,
                    size: 0.5,
                    depth: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                this.#textGeometry.computeBoundingBox();
                this.#textGeometry.translate(
                    -(this.#textGeometry.boundingBox.max.x-0.02)*0.5,
                    -(this.#textGeometry.boundingBox.max.y-0.02)*0.5,
                    -(this.#textGeometry.boundingBox.max.z-0.02)*0.5,
                )
                this.#textMaterial = new THREE.MeshBasicMaterial();
                this.#text = new THREE.Mesh(this.#textGeometry, this.#textMaterial);
                this.#scene.add(this.#text);
            }
        )
    }

    createScene(size, bacgroundColor) {
        //scene
        this.#scene = new THREE.Scene();
        this.#scene.bacground = new THREE.Color(bacgroundColor);

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 40);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //object

        //
        this.#renderer.setAnimationLoop(() => this.#animate());

        //help
        const axesHelper = new THREE.AxesHelper(5);
        this.#scene.add(axesHelper);

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
    }

    disposeScene() {
        this.#gui.destroy();
    }
    #animate() {
        this.#renderer.render(this.#scene, this.camera);
    }
}