import * as Three from 'three'
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//他可以继承一个抽象类，定义了这两个函数
export default class RotateMeshScene {
    #renderer;
    #gui;
    #scene;
    #axesHelper;
    #geometry;
    #meshMaterial;
    #LineMaterial;
    #cubeFace;
    #cubeLine;
    camera;
    constructor(renderer) {
        this.#renderer = renderer;
    }
    createScene(size) {
        //场景参数
        const params = {
            "color": "#294e6b",
            "wireframe": false,
            "axesHelper": false,
            "fog":false
        }

        //scene
        this.#scene = new Three.Scene();

        //相机
        this.camera = new Three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 7);

        //控制器
        const controls = new OrbitControls(this.camera, this.#renderer.domElement);
        controls.update();

        //立方体组
        const group = new Three.Group();
        this.#geometry = new Three.BoxGeometry(4, 1, 1, 1, 1, 1);
        this.#meshMaterial = new Three.MeshBasicMaterial({ "color": params.color });
        this.#LineMaterial = new Three.LineBasicMaterial({ "color": "#81b0d5" });

        this.#cubeFace = new Three.Mesh(this.#geometry, this.#meshMaterial);
        //new Three.Line(this.#geometry, this.#LineMaterial);
        this.#cubeLine = new Three.Line(this.#geometry, this.#LineMaterial);

        group.add(this.#cubeFace, this.#cubeLine)

        this.#scene.add(group);
        
        //fog
        const fog=new Three.Fog(new Three.Color('#9c55af'), 5, 10);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cubeFace))

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
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
        this.#axesHelper = new Three.AxesHelper(5);
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
            .add(params,'fog')
            .onChange(v=>{
                if(v){
                    this.#scene.fog=fog;
                }else{
                    this.#scene.fog=null;
                }
            })
    }
    disposeScene() {
        // todo
        this.#scene.fog=null
        this.#geometry.dispose();
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