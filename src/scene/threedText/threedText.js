import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

//其实这里我可以抽象一个scene父类了
export default class ThreedTextScene {
    #renderer;
    #scene;
    camera;
    #textureLoader;

    #gui;

    #matcapTextures = {};
    #textGeometry;
    #textMaterial;
    #text;
    #donutGeometry;
    #donutGroup;


    constructor(render) {
        this.#renderer = render;
        this.#textureLoader = new THREE.TextureLoader();
        this.#donutGroup = new THREE.Group();
    }

    createScene(size, bacgroundColor) {
        //场景参数
        const params={
            textureType:'1',
        }
        //scene
        this.#scene = new THREE.Scene();
        this.#scene.bacground = new THREE.Color(bacgroundColor);

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 6);

        //控制器
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //object
        const fontLoader = new FontLoader();
        fontLoader.load(
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
                    -(this.#textGeometry.boundingBox.max.x - 0.02) * 0.5,
                    -(this.#textGeometry.boundingBox.max.y - 0.02) * 0.5,
                    -(this.#textGeometry.boundingBox.max.z - 0.02) * 0.5,
                )
                this.#loadTexture('/texture/matcaps/1.png').then(texture => {
                    this.#textMaterial = new THREE.MeshMatcapMaterial({ matcap: texture });
                    this.#text = new THREE.Mesh(this.#textGeometry, this.#textMaterial);
                    this.#scene.add(this.#text);
                    this.#donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
                    for (let i = 0; i < 300; i++) {
                        const donut = new THREE.Mesh(this.#donutGeometry, this.#textMaterial);

                        donut.position.x = (Math.random() - 0.5) * 10;
                        donut.position.y = (Math.random() - 0.5) * 10;
                        donut.position.z = (Math.random() - 0.5) * 10;

                        donut.rotation.x = Math.random() * Math.PI;
                        donut.rotation.y = Math.random() * Math.PI;

                        const scale = Math.random();
                        donut.scale.set(scale, scale, scale);

                        this.#donutGroup.add(donut);
                        this.#scene.add(this.#donutGroup)
                    }
                });
            }
        )

        //
        this.#renderer.setAnimationLoop(() => this.#animate());

        //help
        // const axesHelper = new THREE.AxesHelper(5);
        // this.#scene.add(axesHelper);

        //gui
        const handleChange=(v)=>{
            this.#loadTexture(`/texture/matcaps/${v}.png`).then((texture)=>{
                this.#textMaterial.matcap=texture;
            })
        }
        this.#gui = new GUI({ container: document.getElementById('pannel') });
        this.#createController(this.#gui,'textureType',[params,'textureType',['1','2','3','4','5','6','7','8']],handleChange);
    }

    disposeScene() {
        //texture也要清除
        this.#textGeometry.dispose();
        this.#textMaterial.dispose();
        this.#donutGroup.clear();
        this.#donutGeometry.dispose();
        Object.values(this.#matcapTextures).forEach(v=>{
            v.dispose();
        })
        this.#gui.destroy();
    }
    #animate() {
        this.#renderer.render(this.#scene, this.camera);
    }
    #loadTexture(url) {
        return new Promise((resolve) => {
            if (this.#matcapTextures[url]) {
                resolve(this.#matcapTextures[url]);
            } else {
                this.#textureLoader.load(url,
                    (texture) => {
                        this.#matcapTextures[url] = texture;
                        resolve(texture);
                    }
                )
            }
        })
    }
    #createController(parent, controllerName, params, callback) {
        const controller = parent
            .add(...params)
            .onChange(callback)
        controller.name = controllerName;
        return controller;
    }
}