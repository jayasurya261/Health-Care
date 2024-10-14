import { useState } from 'react'
import Button1 from './components/reuse/button1'
import Loading from './components/reuse/Loading'
import Header from './components/reuse/general/Header'
import { Route, Routes } from 'react-router-dom'
import Login from './userPages/Entrance/Login'
import Register from './userPages/Entrance/Register'
import { Link } from 'react-router-dom'
import Home from './userPages/General/Home'
import Tracking from './userPages/tracking/Tracking.jsx'
import TrackMap from './userPages/tracking/TrackMap.jsx'
import ImageUpload from './userPages/Info/ImageUpload.jsx'
import MyInfo from './userPages/Info/MyInfo.jsx'


function App() {
 

  return (
    <div>
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/home' element={<Home/>}/>z
      <Route path='/track' element={<Tracking/>}/>
      <Route path='/map/:_id' element={<TrackMap/>}/>
      <Route path='/upload' element={<ImageUpload/>}/>
      <Route path='/info' element={<MyInfo/>}/>

      </Routes>
    </div>
  )
}

export default App
