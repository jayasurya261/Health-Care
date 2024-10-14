import React from 'react'
import SideBar from '../../components/SideBar'
import TrackList from './TrackList'

const Tracking = () => {
  return (
    <div className='flex'>
      <SideBar></SideBar>
      <TrackList></TrackList>
    </div>
  )
}

export default Tracking
