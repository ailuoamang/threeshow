import * as Three from 'three'
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//他可以继承一个抽象类，定义了这两个函数
export default class RotateMeshScene {
    #renderer;
    #gui;
    #scene;
    #geometry;
    #material;
    #cube;
    camera;
    constructor(renderer) {
        this.#renderer = renderer;
    }
    createScene(size) {
        //场景参数
        const params={
            "color":"#85ca72",
            "wireframe":false,
        }

        //scene
        this.#scene = new Three.Scene();

        //相机
        this.camera = new Three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 10);

        //控制器
        const controls = new OrbitControls( this.camera, this.#renderer.domElement);
        controls.update();

        //立方体
        this.#geometry = new Three.BoxGeometry(4, 1, 1);
        this.#material = new Three.MeshBasicMaterial({"color":params.color});
        this.#cube = new Three.Mesh(this.#geometry, this.#material);

        this.#scene.add(this.#cube);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cube))

        //gui
        this.#gui=new GUI({container:document.getElementById('pannel')});
        this.#gui
        .addColor(params,'color')
        .onChange(v=>{
            this.#material.color.set(v)
        })
        this.#gui
        .add(params,'wireframe')
        .onChange(v=>{
            this.#material.wireframe=v;
        })
        this.#gui
        .add(this.#cube.position,'x',-10,10,0.001)
        this.#gui
        .add(this.#cube.position,'y',-10,10,0.001)
        this.#gui
        .add(this.#cube.position,'z',-10,10,0.001)
    }
    disposeScene() {
        // todo
        this.#geometry.dispose();
        this.#material.dispose();
        this.#gui.destroy();
    }
    #animate(object) {
        // console.log('帧渲染',container.clientWidth)
        // object.rotation.x += 0.01;
        // object.rotation.y += 0.01;
        //渲染器帧渲染场景和相机
        this.#renderer.render(this.#scene, this.camera);
    }
}