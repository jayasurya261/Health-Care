import React from 'react'
import SideBar from '../../components/SideBar'
import Data from './Data'

const MyInfo = () => {
  return (
    <div className='flex'>
      <SideBar/>
      <div>
      <Data/>
      </div>
      
    </div>
  )
}

export default MyInfo
