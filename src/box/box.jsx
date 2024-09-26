import React, { useEffect,useRef } from 'react'
import * as Three from 'three'
import RotateMeshScene from '../scene/rotatemesh/rotateMesh';

export default function Box() {
    const rendererRef=useRef(null);
    useEffect(() => {
        if(rendererRef.current===null){
            console.log('执行一次')
            // dom节点
            const container = document.getElementById('sceneContainer');
            const canvas=document.getElementById('canvas');
            const size={
                width:container.getBoundingClientRect().width,
                height:container.getBoundingClientRect().height
            }
    
            //渲染器
            rendererRef.current = new Three.WebGLRenderer({"canvas":canvas});
            rendererRef.current.setSize(size.width, size.height);
            rendererRef.current.setPixelRatio(window.devicePixelRatio);

            let rotateMeshScene=new RotateMeshScene(rendererRef.current);
            rotateMeshScene.createScene(size);

            window.addEventListener('resize',()=>{
                console.log(container.getBoundingClientRect())
                //我这里与其他项目不同的是，渲染器并不是直接绑定在body元素上的，而是某个子元素
                //这里通过window的resize函数监听
                //发现会出现缩小,container的宽不随window变化,放大会变化，但是会闪回
                //个人判断是这些css自适应规则发生了冲突以及一些先后顺序
                //经过查询决定采用另一个可以监听任意元素变化的方法ResizeObserver，这个方法会导致three.js不渲染
                //three.js的官网解决方式是侧边栏使用了iframe,我没法在这里使用
                console.log('页面发生缩放',window.innerWidth,container.clientWidth);
                size.width=container.getBoundingClientRect().width;
                size.height=container.getBoundingClientRect().height;
                //更新相机宽高比
                rotateMeshScene.camera.aspect=size.width/size.height;
                //更新相机的投影矩阵
                rotateMeshScene.camera.updateProjectionMatrix();
                //更新渲染器尺寸
                rendererRef.current.setSize(size.width, size.height)
            })
        
            return () => {
                console.log('已清除')
            };
        }
    }, [])
    return (
        <div id='sceneContainer' style={{"height":"100%","width":"100%"}}>
            <canvas id='canvas' style={{"height":"100%","width":"100%"}}></canvas>
        </div>
    )
}
