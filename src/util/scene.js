import * as THREE from 'three';


//啧，js在代码结构上还是太单薄了，
//这个抽象只在类型约束上有意义，大部分代码还是要交给子类去实现
//把这个当成ctr cv的模板代码算了，更符合工程
export default class Scene {
    #renderer;
    #scene;
    camera;

    gui;

    constructor(render) {
        this.#renderer = render;
    }

    createScene(size, bacgroundColor) {
        //不加修饰被子类继承后实例化，具备基础scene,相机
        //scene
        this.#scene = new THREE.Scene();
        this.#scene.bacground = new THREE.Color(bacgroundColor);

        //相机 后面抽象出去
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 40);

        //控制器 这个也抽象出去
        const control = new OrbitControls(this.camera, this.#renderer.domElement);
        control.update();

        //gui
        this.gui = new GUI({ container: document.getElementById('pannel') });
    }
    disposeScene(){

    }
    #animate(){
        this.#renderer.render(this.#scene, this.camera);
    }
}