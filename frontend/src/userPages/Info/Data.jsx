import React, { useState, useEffect } from 'react';
import { images } from '../../assets/images';
import EditProfile from '../../components/EditProfile';
import axios from 'axios';
import ImageUpload from './ImageUpload';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Data = () => {
  const token = localStorage.getItem('token');
  const email = 'surya@gmail.com';
  const [showEdit, setShowEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  function edit() {
    setShowEdit(!showEdit);
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(`http://localhost:3000/user/profile/${email}`,{
          headers: {
            'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
          }
        });
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching profile:', error.message);
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      {/* Edit Profile Modal */}
      <div className={`absolute inset-0 ${showEdit ? 'z-50' : 'hidden'} mt-20`}>
        <EditProfile />
      </div>

      {/* Main Content */}
      <div className={`relative ${showEdit ? 'blur-md' : ''}`}>
        <div className='flex justify-end mt-5 mr-5'>
          <button onClick={edit} className='p-2 bg-blue-600 text-white rounded-[10px]'>
            Edit Profile
          </button>
        </div>

        <div className='flex flex-col justify-center items-center'>
          <img
            src={images.banner}
            className='w-[1400px] h-[250px] ml-10 mr-10 rounded-[20px] mt-10'
            alt="Banner"
          />
          <img src={images.profile} alt="Profile" className='w-32 h-32 -mt-16' />
        </div>
        <div className='flex'>
          <div className='flex w-[500px] justify-around bg-slate-300 ml-10 rounded-[15px] pl-10 pr-10 pt-10 pb-10'>
            <div>
              <p className='mb-3'>Name </p>
              <p className='mb-3'>Email </p>
              <p className='mb-3'>Mobile </p>
              <p className='mb-3'>Location </p>
              <p className='mb-3'>Language </p>
              <p className='mb-3'>Blood Group </p>
            </div>
            <div>
              <p className='mb-3'> : </p>
              <p className='mb-3'> : </p>
              <p className='mb-3'> : </p>
              <p className='mb-3'> : </p>
              <p className='mb-3'> : </p>
              <p className='mb-3'> : </p>
            </div>
            <div>
              <p className='mb-3'>{profile.name}</p>
              <p className='mb-3'>{profile.email}</p>
              <p className='mb-3'>{profile.mobile}</p>
              <p className='mb-3'>{profile.place}</p>
              <p className='mb-3'>{profile.language}</p>
              <p className='mb-3'>{profile.blood}</p>
            </div>
          </div>
          <ImageUpload />
        </div>
      </div>

      {/* Animated Button at the Bottom */}
      <motion.div
        className="flex justify-center mt-10"
      >
        <Link to="/info/ai">
       
        <div class="relative">
  <span class="absolute inset-0 rounded-md glow"></span>
  <button class="bg-sky-950 text-sky-400 border border-sky-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group w-[400px] z-10">
    <span class="bg-sky-400 shadow-sky-400 absolute -top-[150%] left-0 inline-flex w-full h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
    AI Analyze
  </button>
</div>

        </Link>
      </motion.div>

      {/* Background Overlay */}
      {showEdit && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />}
    </div>
  );
};

export default Data;
