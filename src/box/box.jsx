import React, { useEffect, useRef } from 'react'
import * as Three from 'three'
import RotateMeshScene from '../scene/rotatemesh/rotateMesh';
import DebugGUIScene from '../scene/debugGUI/debugGUI';

export default function Box({ sceneId }) {
    const rendererRef = useRef(null);
    const containerRef=useRef(null);
    const sizeRef=useRef({});
    const sceneRef=useRef(null);

    useEffect(()=>{
        containerRef.current = document.getElementById('sceneContainer');
        const canvas = document.getElementById('canvas');
        sizeRef.current = {
            width: containerRef.current.getBoundingClientRect().width,
            height: containerRef.current.getBoundingClientRect().height
        }
        if (rendererRef.current === null) {
            console.log('创建renderer')
            //渲染器
            rendererRef.current = new Three.WebGLRenderer({ "canvas": canvas,antialias: true });
            rendererRef.current.setSize(sizeRef.current.width, sizeRef.current.height);
            rendererRef.current.setPixelRatio(window.devicePixelRatio);
        }
        return () => {
            console.log('释放gpu资源')
            rendererRef.current.dispose();
            rendererRef.current=null;
        };
    },[])
    useEffect(() => {
        if(sceneRef.current) {
            console.log('清除上一个scene');
            sceneRef.current.disposeScene();
        }
        console.log('创建新scene')
        switch (sceneId) {
            case "RotateMesh":
                sceneRef.current = new RotateMeshScene(rendererRef.current);
                break;
            case "DebugGUI":
                sceneRef.current = new DebugGUIScene(rendererRef.current);
                break;
            default:
                break;
        }
        sceneRef.current.createScene(sizeRef.current);

        window.addEventListener('resize', () => {
            console.log(containerRef.current.getBoundingClientRect())
            //我这里与其他项目不同的是，渲染器并不是直接绑定在body元素上的，而是某个子元素
            //这里通过window的resize函数监听
            //发现会出现缩小,container的宽不随window变化,放大会变化，但是会闪回
            //个人判断是这些css自适应规则发生了冲突以及一些先后顺序
            //经过查询决定采用另一个可以监听任意元素变化的方法ResizeObserver，这个方法会导致three.js不渲染
            //three.js的官网解决方式是侧边栏使用了iframe,我没法在这里使用
            console.log('页面发生缩放', window.innerWidth, containerRef.current.clientWidth);
            sizeRef.current.width = containerRef.current.getBoundingClientRect().width;
            sizeRef.current.height = containerRef.current.getBoundingClientRect().height;
            //更新相机宽高比
            sceneRef.current.camera.aspect = sizeRef.current.width / sizeRef.current.height;
            //更新相机的投影矩阵
            sceneRef.current.camera.updateProjectionMatrix();
            //更新渲染器尺寸
            rendererRef.current.setSize(sizeRef.current.width, sizeRef.current.height)
        })
    }, [sceneId])
    return (
        <div id='sceneContainer' style={{ "height": "100%", "width": "100%","position":"relative" }}>
            <div id='pannel' style={{'position':"absolute","top":"15px","right":"50px"}}></div>
            <canvas id='canvas' style={{ "height": "100%", "width": "100%" }}></canvas>
        </div>
    )
}
