import React, { useEffect, useState } from 'react';
import { images } from '../assets/images';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('type');
    if (type === 'admin') {
      setIsAdmin(true);
      console.log(isAdmin);
    }
  }, [isAdmin]); // Dependency to update when isAdmin changes

  function logout() {
    localStorage.clear();
    navigate('/login')
  }

  return (
    <div className='w-[220px] bg-blue-50 h-[100vh] flex flex-col justify-between'>
      <div>
        <div className='flex pt-[20px] pl-[30px] pb-[20px] border-b border-gray-600 '>
          <img src={images.logo} alt="" className='w-[30px]' />
          <p className='ml-[10px] font-medium text-red-700'>Health Care</p>
        </div>
        <div className='ml-[30px] mt-10 text-gray-500 font-medium'>
          <p className='text-[13px] font-bold'>MENU</p>
          {isAdmin ? (
            <div>
              <div className='flex'>
                <img src={images.info} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                <p className='mb-3'>Track Info</p>
              </div>
              <div className='flex'>
                <img src={images.tablet} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                <p>Isolation</p>
              </div>
            </div>
          ) : (
            <div className='mt-10 ml-[30px]'>
              <Link to='/info'>
                <div className='flex'>
                  <img src={images.info} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                  <p className='mb-3'>My Info</p>
                </div>
              </Link>
              <Link to='/isolation/home'>
                <div className='flex'>
                  <img src={images.tablet} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                  <p>Isolation</p>
                </div>
              </Link>
              <Link to='/video/all'>
                <div className='flex'>
                  <img src={images.video} className='w-[20px] h-[20px] mr-4 opacity-50' alt="" />
                  <p>Consultancy</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <button onClick={logout}>LOGOUT</button> {/* Correct way to call logout */}
      </div>
    </div>
  );
}

export default SideBar;
