import React, { useEffect,useRef } from 'react'
import * as Three from 'three'

export default function Box() {
    const sceneRef=useRef(null);
    useEffect(() => {
        if(sceneRef.current===null){
            console.log('执行一次')
            // dom节点
            const container = document.getElementById('sceneContainer');
            const size={
                width:container.clientWidth,
                height:container.clientHeight
            }

            sceneRef.current= new Three.Scene();
            
            //相机
            const camera = new Three.PerspectiveCamera(75, size.width/ size.height, 0.1, 100);
            camera.position.set(0, 0, 10);
    
            //立方体
            const geometry = new Three.BoxGeometry(1, 1, 1);
            const material = new Three.MeshBasicMaterial();
            const cube = new Three.Mesh(geometry, material);
    
            sceneRef.current.add(cube);
    
            //渲染器
            const renderer = new Three.WebGLRenderer();
            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(window.devicePixelRatio)
    
            container.append(renderer.domElement);
    
            //renderer.render(sceneRef.current, camera)

            const animate=()=>{
                // console.log('帧渲染',container.clientWidth)
                cube.rotation.x+=0.01;
                cube.rotation.y+=0.01;
                //渲染器帧渲染场景和相机
                renderer.render(sceneRef.current, camera);
            }

            //动画循环
            renderer.setAnimationLoop(animate);

            window.addEventListener('resize',()=>{
                //我这里与其他项目不同的是，渲染器并不是直接绑定在body元素上的，而是某个子元素
                //这里通过window的resize函数监听
                //发现会出现缩小,container的宽不随window变化,放大会变化，但是会闪回
                //个人判断是这些css自适应规则发生了冲突以及一些先后顺序
                //经过查询决定采用另一个可以监听任意元素变化的方法ResizeObserver，这个方法会导致three.js不渲染
                //three.js的官网解决方式是侧边栏使用了iframe,我没法在这里使用
                console.log('页面发生缩放',window.innerWidth,container.clientWidth);
                size.width=container.clientWidth;
                size.height=container.clientHeight;
                //更新相机宽高比
                camera.aspect=size.width/size.height;
                //更新相机的投影矩阵
                camera.updateProjectionMatrix();
                //更新渲染器尺寸
                renderer.setSize(size.width, size.height)
            })

            // const resizeObserver = new ResizeObserver(() => {
            //     const newWidth = container.clientWidth;
            //     const newHeight = container.clientHeight;
            //     console.log('容器大小变化', newWidth, newHeight);
            // });
        
            // resizeObserver.observe(container);
        
            // return () => {
            //     resizeObserver.disconnect();
            //     renderer.dispose();
            // };
        }
    }, [])
    return (
        <div id='sceneContainer' style={{"height":"100%","width":"100%"}}></div>
    )
}
