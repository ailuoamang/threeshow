import React, { useEffect, useState } from 'react'
import sideBarCss from './sideBar.module.css'

export default function SideBar(props) {
  const [list, setList] = useState([])
  useEffect(() => {
    getSceneList().then(data=>setList(data));
  }, [])

  const getSceneList = async () => {//always return promise
    try {
      const response = await fetch('../scenelist.json');
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      return data.list;
    } catch (error) {
      console.log(error.message)
      return [];
    }
  }

  const handleClick=(id)=>{
    console.log(id);
    props.changeScene(id)
  }

  const listItems = list.map(value =>
    <div key={value.id} className={sideBarCss.item} onClick={()=>handleClick(value.id)}>
      <p className={sideBarCss.title}>{value.title}</p>
      <p className={sideBarCss.description}>{value.description}</p>
    </div>
  )
  return (
    <div className={sideBarCss.container}>
      {
        listItems
      }
    </div>
  )
}
