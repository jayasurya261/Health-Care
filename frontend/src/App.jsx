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
import AdminLogin from './adminPages/AdminLogin.jsx'
import AdminHome from './adminPages/AdminHome.jsx'
import Form from './userPages/Isolation/Form.jsx'
import IsolationHome from './userPages/Isolation/IsolationHome.jsx'
import IsolationInfo from './userPages/Isolation/IsolationInfo.jsx'
import JitsiMeet from './userPages/VideoConsultant/JitsiMeet.jsx'
import ConsultancyRequest from './userPages/VideoConsultant/ConsultancyRequest.jsx'
import AllConsultancyRequest from './userPages/VideoConsultant/AllConsultancyRequest.jsx'
import ProcessImagesButton from './userPages/Info/AIAnalyze.jsx'
import AllIsolationRequest from './adminPages/AllIsolationRequest.jsx'
import EmergencyComponent from './userPages/tracking/EmergencyComponent.jsx'


function App() {
 

  return (
    <div>
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<Home/>}/>z
      <Route path='/track' element={<Tracking/>}/>
      <Route path='/map/:_id' element={<TrackMap/>}/>
      <Route path='/upload' element={<ImageUpload/>}/>
      <Route path='/info' element={<MyInfo/>}/>
      <Route path='/admin/login' element={<AdminLogin/>}/>
      <Route path='/admin/home' element={<AdminHome/>}/>
      <Route path='/form' element={<Form/>}/>
      <Route path='/isolation/home' element={<IsolationHome/>}/>
      <Route path='/isolation/info/:_id' element={<IsolationInfo/>}/>
      <Route path='/video/consultant/:videolink' element={<JitsiMeet/>}/>
      <Route path='/video/request' element={<ConsultancyRequest/>}/>
      <Route path='/video/all' element={<AllConsultancyRequest/>}/>
      <Route path='/info/ai' element={<ProcessImagesButton/>}/>
      <Route path='/isolation/info/all' element={<AllIsolationRequest/>}/>
      <Route path='/emergency' element={<EmergencyComponent/>}/>

      </Routes>
    </div>
  )
}

export default App
