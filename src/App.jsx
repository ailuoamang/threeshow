import React from 'react'
import './App.css'
import Box from './box/box'
import SideBar from './sidebar/sideBar'

export default function App() {
  return (
    <div className='background'>
      <div className='container'>
        <div className='sidebarContainer'>
          <SideBar/>
        </div>
        <div className='boxContainer'>
          <Box/>
        </div>
      </div>
    </div>
  )
}
