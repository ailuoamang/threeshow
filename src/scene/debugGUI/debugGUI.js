import * as Three from 'three'

//他可以继承一个抽象类，定义了这两个函数
export default class DebugGUIScene {

    #renderer;
    #scene;
    #cube;
    camera;
    constructor(renderer) {
        this.#renderer = renderer;
    }
    createScene(size) {
        this.#scene = new Three.Scene();

        //相机
        this.camera = new Three.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(0, 0, 10);

        //立方体
        const geometry = new Three.BoxGeometry(4, 1, 1);
        const material = new Three.MeshBasicMaterial();
        this.#cube = new Three.Mesh(geometry, material);

        this.#scene.add(this.#cube);

        this.#renderer.setAnimationLoop(() => this.#animate(this.#cube))
    }
    disposeScene() {
        // todo
    }
    #animate(object) {
        // console.log('帧渲染',container.clientWidth)
        object.rotation.x += 0.01;
        object.rotation.y += 0.01;
        //渲染器帧渲染场景和相机
        this.#renderer.render(this.#scene, this.camera);
    }
}