import React from 'react'
import { images } from '../assets/images'
import { Link } from 'react-router-dom'

const SideBar = () => {
  return (
    <div className='w-[220px] bg-blue-50 h-[100vh]'>
        <div className='flex pt-[20px] pl-[30px] pb-[20px] border-b border-gray-600 '>
            <img src={images.logo} alt="" className='w-[30px]'/>
            <p className='ml-[10px] font-medium text-red-700'>Health Care</p>
        </div>
        <div className='ml-[30px] mt-10 text-gray-500 font-medium'>
            <p className='text-[13px] font-bold'>MENU</p>
            <div className='mt-10 ml-[30px]'>
               <div className='flex'>
                <img src={images.info} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
               <p className='mb-3'>My Info</p>
               </div>
               <Link to='/track'>
               <div className='flex'>
                <img src={images.location} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                <p className='mb-3'>Tracking</p>
               </div>
               </Link>
               <div className='flex'>
                <img src={images.tablet} className='w-[20px] h-[20px] mr- opacity-50' alt="" />
                <p>Pharmacy</p>
               </div>
                
                
            </div>
        </div>
    </div>
  )
}

export default SideBar
