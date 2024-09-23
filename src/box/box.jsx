import React, { useEffect,useRef } from 'react'
import * as Three from 'three'

export default function Box() {
    const sceneRef=useRef(null);
    useEffect(() => {
        console.log('首次加载')
        if(sceneRef.current===null){
            const container = document.getElementById('sceneContainer');

            sceneRef.current= new Three.Scene();
    
            const camera = new Three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
            camera.position.set(0, 0, 10);
    
            const geometry = new Three.BoxGeometry(1, 1, 1);
            const material = new Three.MeshBasicMaterial();
            const cube = new Three.Mesh(geometry, material);
    
            sceneRef.current.add(cube);
    
            const renderer = new Three.WebGLRenderer();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio)
    
            container.append(renderer.domElement);
    
            // renderer.render(sceneRef.current, camera)

            const animate=()=>{
                cube.rotation.x+=0.01;
                cube.rotation.y+=0.01;

                renderer.render(sceneRef.current, camera)
            }
            
            renderer.setAnimationLoop(animate);

        }
    }, [])
    return (
        <div id='sceneContainer' style={{"height":"100%"}}></div>
    )
}
