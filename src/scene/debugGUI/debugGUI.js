import * as THREE from 'three'
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//他可以继承一个抽象类，定义了这两个函数
export default class RotateMeshScene {
    #renderer;
    #gui;
    #scene;
    #axesHelper;
    #boxGeometry;
    #torusKnotGeometry;
    #meshMaterial;
    #LineMaterial;
    #cubeFace;
    #cubeLine;
    #toruszknot;
    camera;
    constructor(renderer) {
        this.#renderer = renderer;
    }
    createScene(size) {
        //场景参数
        const params = {
            "meshType":"cubeGroup",
            "color": "#294e6b",
            "wireframe": false,
            "axesHelper": false,
            "fog": false
        }

        //scene
        this.#scene = new THREE.Scene();

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 7);
        this.camera.layers.enable(0);//添加该层成员
        this.camera.layers.enable(1);
        this.camera.layers.toggle(1);

        //控制器
        const controls = new OrbitControls(this.camera, this.#renderer.domElement);
        controls.update();

        //立方体组
        const group = new THREE.Group();
        this.#boxGeometry = new THREE.BoxGeometry(4, 1, 1, 1, 1, 1);
        this.#meshMaterial = new THREE.MeshBasicMaterial({ "color": params.color });
        this.#LineMaterial = new THREE.LineBasicMaterial({ "color": "#81b0d5" });

        this.#cubeFace = new THREE.Mesh(this.#boxGeometry, this.#meshMaterial);
        this.#cubeFace.layers.set(0);//设置成员为层，并删除所有其他层的成员
        this.#cubeLine = new THREE.Line(this.#boxGeometry, this.#LineMaterial);
        this.#cubeLine.layers.set(0);

        group.add(this.#cubeFace, this.#cubeLine)

        this.#scene.add(group);

        //环面节
        this.#torusKnotGeometry= new THREE.TorusKnotGeometry(1, 0.4, 128, 16);
        this.#toruszknot= new THREE.Mesh(this.#torusKnotGeometry,this.#meshMaterial);
        this.#toruszknot.layers.set(1);
        this.#scene.add(this.#toruszknot)


        //fog
        const fog = new THREE.Fog(new THREE.Color('#9c55af'), 5, 10);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cubeFace))

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
        //mesh
        this.#gui
            .add(params,'meshType',['cubeGroup','torusKnot'])
            .onChange(v=>{
                console.log(this.#scene);
                if(v==='cubeGroup'){
                    this.camera.layers.toggle(0);//切换图层成员
                    this.camera.layers.toggle(1);
                }else if(v==="torusKnot"){
                    this.camera.layers.toggle(0)
                    this.camera.layers.toggle(1);
                }
            })
        //mesh颜色
        this.#gui
            .addColor(params, 'color')
            .onChange(v => {
                this.#meshMaterial.color.set(v)
            })
        //wireframe
        this.#gui
            .add(params, 'wireframe')
            .onChange(v => {
                this.#meshMaterial.wireframe = v;
            })

        //xyz
        this.#gui
            .add(this.#cubeFace.position, 'x', -10, 10, 0.001)
        this.#gui
            .add(this.#cubeFace.position, 'y', -10, 10, 0.001)
        this.#gui
            .add(this.#cubeFace.position, 'z', -10, 10, 0.001)

        //辅助线
        this.#axesHelper = new THREE.AxesHelper(5);
        this.#axesHelper.layers.enable(0);//添加该层成员
        this.#axesHelper.layers.enable(1);

        this.#gui
            .add(params, 'axesHelper')
            .onChange(v => {
                if (v) {
                    this.#scene.add(this.#axesHelper);
                } else {
                    this.#scene.remove(this.#axesHelper)
                }
            })

        //fog
        this.#gui
            .add(params, 'fog')
            .onChange(v => {
                if (v) {
                    this.#scene.fog = fog;
                } else {
                    this.#scene.fog = null;
                }
            })
    }
    disposeScene() {
        // todo
        this.#scene.fog = null
        this.#boxGeometry.dispose();
        this.#meshMaterial.dispose();
        this.#LineMaterial.dispose();
        this.#axesHelper.dispose();
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