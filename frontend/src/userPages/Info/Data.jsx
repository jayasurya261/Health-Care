import React, { useState, useEffect } from 'react';
import { images } from '../../assets/images';
import EditProfile from '../../components/EditProfile';
import axios from 'axios';
import ImageUpload from './ImageUpload';

const Data = () => {
  const email = 'surya@gmail.com';
  const [showEdit, setShowEdit] = useState(false);
  const [profile, setProfile] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State to track loading

  function edit() {
    setShowEdit(!showEdit); // Toggle modal visibility
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get(`http://localhost:3000/user/profile/${email}`, {
          // Passing the email as a query param
        });
        setProfile(response.data); // Store the profile data in state
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.log('Error fetching profile:', error.message);
        setLoading(false); // Also stop loading if there's an error
      }
    }
    fetchProfile(); // Call the fetch function when the component mounts
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state while profile data is being fetched
  }

  if (!profile) {
    return <div>Error loading profile</div>; // Handle case when profile is not loaded properly
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
            <p className='mb-3'>
              {profile.location}
            </p> 
            <p className='mb-3'>{profile.language}</p>
            <p className='mb-3'>{profile.blood}</p>
          </div>
        </div>
        <ImageUpload/>
        </div>
      </div>

      {/* Background Overlay */}
      {showEdit && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />}
    </div>
  );
};

export default Data;
