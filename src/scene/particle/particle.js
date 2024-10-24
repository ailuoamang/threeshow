import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default class ParticleScene {
    #renderer;
    #scene;
    camera;

    #textureLoader;

    #gui;

    #boxGeometry;
    #boxMaterial;
    #box;

    #particlesGeometry;
    #particleMaterial;
    #particleTexture;
    #particle;

    constructor(render) {
        this.#renderer = render;
        this.#textureLoader=new THREE.TextureLoader();
        
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

        //粒子
        this.#particlesGeometry=new THREE.BufferGeometry();

        const positions=new Float32Array(10000*3);//这个3如果明白数据是如何传递给gpu的，就很好理解
        const colors=new Float32Array(10000*3);
        
        for (let i = 0; i < 10000*3; i++) {
            positions[i]=(Math.random()-0.5)*10            
            colors[i]=Math.random();
        }
        this.#particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
        this.#particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

        this.#particleTexture=this.#textureLoader.load('/texture/particles/2.png');
        this.#particleMaterial=new THREE.PointsMaterial();
        this.#particleMaterial.size=0.1;
        this.#particleMaterial.sizeAttenuation=true;
        this.#particleMaterial.color=new THREE.Color('#ff88cc');
        this.#particleMaterial.transparent=true;
        this.#particleMaterial.alphaMap=this.#particleTexture;
        // this.#particleMaterial.alphaTest=0.001;//1
        // this.#particleMaterial.depthTest=false;//2
        this.#particleMaterial.depthWrite=false;//3
        this.#particleMaterial.blending=THREE.AdditiveBlending;
        this.#particleMaterial.vertexColors=true;

        this.#particle=new THREE.Points(this.#particlesGeometry,this.#particleMaterial);
        
        this.#scene.add(this.#particle);

        const clock=new THREE.Clock();
        this.#renderer.setAnimationLoop(() => this.#animate(clock))

        //gui
        this.#gui = new GUI({ container: document.getElementById('pannel') });
    }
    disposeScene(){
        console.log('清除');
        this.#boxGeometry.dispose();
        this.#boxMaterial.dispose();
        this.#gui.destroy();
    }
    #animate(clock){
        const elapsedTime=clock.getElapsedTime();
        for (let i = 0; i < 10000; i++) {
            const i3=i*3;
            const x=this.#particlesGeometry.attributes.position.array[i3];//这里的数学意义是相位偏移
            this.#particlesGeometry.attributes.position.array[i3+1]=Math.sin(elapsedTime+x);
        }
        this.#particlesGeometry.attributes.position.needsUpdate=true;
        this.#renderer.render(this.#scene, this.camera);
    }
}