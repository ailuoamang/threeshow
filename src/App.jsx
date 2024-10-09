import React, { useEffect, useState } from 'react'
import './App.css'
import Box from './component/box/box'
import SideBar from './component/sidebar/sideBar'

export default function App() {
  const [scene,setScene]=useState('RotateMesh');

  const changeScene=(id)=>{
    setScene(id)
  }
  return (
    <div className='background'>
      <div className='container'>
        <div className='sidebarContainer'>
          <SideBar changeScene={changeScene}/>
        </div>
        <div className='boxContainer'>
          <Box sceneId={scene}/>
        </div>
      </div>
    </div>
  )
}
