import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

export default class PathEditor {
    #renderer;
    #scene;
    camera;

    #gui;

    #orbitControl;
    #transformControl;

    #catmullData;
    #catmullGeometry;
    #catmullMaterial;
    #catmullMesh;

    #boxGeometry;
    #boxMaterial;

    constructor(render) {
        this.#renderer = render;
    }

    createScene(size) {
        //scene
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color('#f3f6f6');

        //相机
        this.camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
        this.camera.position.set(10, 10, 10);

        //控制器
        this.#orbitControl = new OrbitControls(this.camera, this.#renderer.domElement);
        this.#orbitControl.update();
        this.#transformControl = new TransformControls(this.camera, this.#renderer.domElement);
        this.#scene.add(this.#transformControl);

        //网格
        const gridSize = 20;
        const divisions = 20;

        const gridHelper = new THREE.GridHelper(gridSize, divisions);
        this.#scene.add(gridHelper);

        //卡特穆尔样条
        //增加addPoint功能，在某个范围内随机产生point，悬浮到point上显示transformcontrol,切换绑定的point
        //拖拽结束后,如何更新整个卡特穆尔样条呢？
        const originalVector = [
            new THREE.Vector3(-5, 0, 5),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5)
        ]

        this.#catmullData = new THREE.CatmullRomCurve3(originalVector);
        //插值点可以参数化
        const points = this.#catmullData.getPoints(50);
        this.#catmullGeometry = new THREE.BufferGeometry().setFromPoints(points);
        this.#catmullMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.#catmullMesh = new THREE.Line(this.#catmullGeometry, this.#catmullMaterial);
        this.#scene.add(this.#catmullMesh);

        //初始卡特穆尔设置四个移动点
        //悬浮高亮
        //之后在限定范围内添加随机点，然后更新样条
        for (let i = 0; i < originalVector.length; i++) {
            const vector3 = originalVector[i];
            this.#boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            this.#boxMaterial = new THREE.MeshBasicMaterial({ color: "#C762B0" });
            const cube = new THREE.Mesh(this.#boxGeometry, this.#boxMaterial);
            cube.position.set(...vector3);
            this.#scene.add(cube)
        }

        //测试
        const cube2 = new THREE.Mesh(this.#boxGeometry, this.#boxMaterial);
        cube2.position.set(0, 0, 4);
        // transformControl.attach(cube2);
        this.#scene.add(cube2)

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let isHovering = false;
        let isMouseDown = false;

        // 鼠标移动事件
        const canvas = this.#renderer.domElement;
        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            console.log(mouse)
            raycaster.setFromCamera(mouse, this.camera);//这个坐标特指threejs所使用的canvas
            const intersects = raycaster.intersectObject(cube2);
            console.log(intersects)

            // 如果鼠标悬浮并且没有附加 TransformControls，则附加它
            if (intersects.length > 0) {
                if (!isHovering) {
                    isHovering = true;
                    this.#transformControl.attach(cube2);
                }
            }

        });
        // 监听 TransformControls 的事件
        this.#transformControl.addEventListener('mouseDown', (event) => {
            console.log('mouseDown', event);
            isMouseDown = true;
            this.#orbitControl.enabled = false;
        });
        this.#transformControl.addEventListener('mouseUp', (event) => {
            console.log('mouseUp', event);
            isMouseDown = false;
            this.#orbitControl.enabled = true;
        });

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });

        this.#renderer.setAnimationLoop(() => this.#animate());
    }

    disposeScene() {
        this.#gui.destroy();
    }

    #animate() {
        this.#renderer.render(this.#scene, this.camera);
    }
}