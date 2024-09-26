import React, { useEffect, useRef } from 'react'
import * as Three from 'three'
import RotateMeshScene from '../scene/rotatemesh/rotateMesh';
import DebugGUIScene from '../scene/debugGUI/debugGUI';

export default function Box({ sceneId }) {
    const rendererRef = useRef(null);
    let scene;
    useEffect(() => {
        
        // dom节点
        const container = document.getElementById('sceneContainer');
        const canvas = document.getElementById('canvas');
        const size = {
            width: container.getBoundingClientRect().width,
            height: container.getBoundingClientRect().height
        }

        if (rendererRef.current === null) {
            console.log('执行一次')
            //渲染器
            rendererRef.current = new Three.WebGLRenderer({ "canvas": canvas });
            rendererRef.current.setSize(size.width, size.height);
            rendererRef.current.setPixelRatio(window.devicePixelRatio);
        }
        switch (sceneId) {
            case "RotateMesh":
                scene = new RotateMeshScene(rendererRef.current);
                break;
            case "DebugGUI":
                scene = new DebugGUIScene(rendererRef.current);
                break;
            default:
                break;
        }
        scene.createScene(size);

        window.addEventListener('resize', () => {
            console.log(container.getBoundingClientRect())
            //我这里与其他项目不同的是，渲染器并不是直接绑定在body元素上的，而是某个子元素
            //这里通过window的resize函数监听
            //发现会出现缩小,container的宽不随window变化,放大会变化，但是会闪回
            //个人判断是这些css自适应规则发生了冲突以及一些先后顺序
            //经过查询决定采用另一个可以监听任意元素变化的方法ResizeObserver，这个方法会导致three.js不渲染
            //three.js的官网解决方式是侧边栏使用了iframe,我没法在这里使用
            console.log('页面发生缩放', window.innerWidth, container.clientWidth);
            size.width = container.getBoundingClientRect().width;
            size.height = container.getBoundingClientRect().height;
            //更新相机宽高比
            scene.camera.aspect = size.width / size.height;
            //更新相机的投影矩阵
            scene.camera.updateProjectionMatrix();
            //更新渲染器尺寸
            rendererRef.current.setSize(size.width, size.height)
        })

        return () => {
            console.log('已清除')
        };
    }, [sceneId])
    return (
        <div id='sceneContainer' style={{ "height": "100%", "width": "100%" }}>
            <canvas id='canvas' style={{ "height": "100%", "width": "100%" }}></canvas>
        </div>
    )
}
