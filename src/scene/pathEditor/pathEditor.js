import * as THREE from 'three';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export default class PathEditor {
    #renderer;
    #scene;
    camera;

    #gui;

    #orbitControl;
    #transformControl;

    #gridHelper;

    #originalVector;//vector数据
    #catmullData;
    #catmullGeometry;
    #catmullMaterial;
    #catmullMesh;

    #boxGeometry;
    #boxMaterial;

    #aimPointer;//当前选中点
    #points;

    constructor(render) {
        this.#renderer = render;
        this.#originalVector = [
            new THREE.Vector3(-5, 0, 5),
            new THREE.Vector3(-5, 5, 5),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(5, -5, 5)
        ]
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

        this.#gridHelper = new THREE.GridHelper(gridSize, divisions);
        this.#scene.add(this.#gridHelper);

        //卡特穆尔样条
        //增加addPoint功能，在某个范围内随机产生point，悬浮到point上显示transformcontrol,切换绑定的point
        //拖拽结束后,更新整个卡特穆尔样条
        this.#catmullData = new THREE.CatmullRomCurve3(this.#originalVector);
        this.#points = this.#catmullData.getPoints(50);
        this.#catmullGeometry = new THREE.BufferGeometry().setFromPoints(this.#points);
        this.#catmullMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        this.#catmullMesh = new THREE.Line(this.#catmullGeometry, this.#catmullMaterial);
        this.#scene.add(this.#catmullMesh);

        //初始卡特穆尔设置四个移动点
        //悬浮高亮
        //之后在限定范围内添加随机点，然后更新样条
        this.#boxMaterial = new THREE.MeshBasicMaterial({ color: "#C762B0" });
        for (let i = 0; i < this.#originalVector.length; i++) {
            const vector3 = this.#originalVector[i];
            //这里每一个都必须创建一个新的geometry，因为后面需要改变position
            this.#boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const cube = new THREE.Mesh(this.#boxGeometry, this.#boxMaterial);
            cube.name = `editorPoint-${i}`;
            cube.position.set(...vector3);
            this.#scene.add(cube)
        }

        //射线拾取特定cube添加transformControl
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // 鼠标移动事件
        const canvas = this.#renderer.domElement;
        window.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // console.log(mouse)
            raycaster.setFromCamera(mouse, this.camera);//这个坐标特指threejs所使用的canvas
            const intersects = raycaster.intersectObjects(this.#scene.children);
            // console.log(intersects)

            if (intersects.length <= 0) return;
            const result = this.#hasEditorPointer(intersects);
            if (!result[0]) return;
            console.log('拾取到了可标记点');
            this.#aimPointer = result[1];
            this.#transformControl.attach(result[1]);
        });
        // 监听 TransformControls 的事件
        this.#transformControl.addEventListener('mouseDown', () => {
            // console.log('mouseDown', event);
            this.#orbitControl.enabled = false;
        });
        this.#transformControl.addEventListener('mouseUp', () => {
            // console.log('mouseUp', event);
            this.#orbitControl.enabled = true;
        });
        this.#transformControl.addEventListener('objectChange', () => {
            // console.log('objectChange', this.#aimPointer.position);
            //在移动点位的时候，更新卡特穆尔曲线的geometry
            // console.log('mesh', this.#catmullMesh)
            const nameSplitArray = this.#aimPointer.name.split('-');
            const index = Number(nameSplitArray[1]);
            this.#originalVector[index] = this.#aimPointer.position.clone();
            this.#catmullData = new THREE.CatmullRomCurve3(this.#originalVector);
            this.#updateCatmull();
        });

        //gui   
        const guiParam = {
            addPoint: () => {
                const x = ((Math.random() * 2) - 1) * 10;
                const y = ((Math.random() * 2) - 1) * 10;
                const z = ((Math.random() * 2) - 1) * 10;
                this.#originalVector.push(new THREE.Vector3(x, y, z));
                //曲线更新
                this.#catmullData = new THREE.CatmullRomCurve3(this.#originalVector);
                this.#updateCatmull();

                //box
                this.#boxGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                const cube = new THREE.Mesh(this.#boxGeometry, this.#boxMaterial);
                cube.name = `editorPoint-${this.#originalVector.length - 1}`;
                cube.position.set(...this.#originalVector.at(-1));
                this.#scene.add(cube)
            },
            savePoint: () => {
                let array = [];
                for (let i = 0; i < this.#points.length; i++) {
                    const vector = this.#points[i];
                    array.push(vector.toArray());
                }
                console.log(array);
                const json = { 'points': array };
                const blob = new Blob([JSON.stringify(json, null, 2)], {
                    type: "application/json"
                })
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `points.json`;
                a.click();
                URL.revokeObjectURL(url);
            }
        }
        this.#gui = new GUI({ container: document.getElementById('pannel') });
        this.#gui.add(guiParam, 'addPoint');
        this.#gui.add(guiParam, 'savePoint');
        this.#renderer.setAnimationLoop(() => this.#animate());
    }

    //我现在需要就是说，
    //editor点需要添加顺序id
    #updateCatmull() {
        this.#points = this.#catmullData.getPoints(50);
        this.#catmullGeometry = new THREE.BufferGeometry().setFromPoints(this.#points);
        this.#catmullMesh.geometry = this.#catmullGeometry;
    }

    #hasEditorPointer(array) {
        let flag = false
        let editorPoint = null;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.object.name.indexOf('editorPoint') !== -1) {
                flag = true;
                editorPoint = element.object;
            }
        }
        return [flag, editorPoint];
    }

    disposeScene() {
        this.#catmullMaterial.dispose();
        this.#catmullGeometry.dispose();

        //boxmesh没删
        this.#boxGeometry.dispose();
        this.#boxMaterial.dispose();

        this.#gridHelper.dispose();
        this.#gui.destroy();
    }

    #animate() {
        this.#renderer.render(this.#scene, this.camera);
    }
}