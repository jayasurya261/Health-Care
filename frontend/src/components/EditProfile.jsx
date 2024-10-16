import React, { useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const email = 'surya@gmail.com'
  // Define states for form inputs
  const [mobile, setMobile] = useState('');
  const [place, setPlace] = useState('');
  const [language, setLanguage] = useState('');
  const [blood, setBlood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to handle the form submission
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = {
        mobile,
        place,
        language,
        blood
      };

      // Replace the URL with your backend API endpoint
      const response = await axios.put(`http://localhost:3000/user/profile/${email}`, updatedProfile);

      // Handle success
      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
      }
    } catch (error) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div className='flex flex-col justify-center items-center'>
          <div className='flex flex-col bg-slate-300 p-5 rounded-2xl shadow-2xl pl-10 pr-10'>
            <p className='text-3xl font-medium'>EDIT PROFILE</p>
            
            <input 
              type="text" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
              placeholder='Enter Mobile number' 
              className='p-2 w-[300px] mb-10 mt-10 rounded-[10px]' 
            />
            
            <input 
              type="text" 
              value={place} 
              onChange={(e) => setPlace(e.target.value)} 
              placeholder='Enter Location' 
              className='p-2 w-[300px] mb-10 rounded-[10px]' 
            />
            
            <input 
              type="text" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              placeholder='Enter Language' 
              className='p-2 w-[300px] rounded-[10px] mb-10' 
            />
            
            <input 
              type="text" 
              value={blood} 
              onChange={(e) => setBlood(e.target.value)} 
              placeholder='Enter Blood Group' 
              className='p-2 w-[300px] mb-2 rounded-[10px] mb-10' 
            />

            <button 
              onClick={handleUpdate} 
              className='p-3 bg-blue-600 text-white rounded-2xl mt-4'
              disabled={loading}
            >
              {loading ? 'Updating...' : 'UPDATE'}
            </button>

            {/* Display success or error message */}
            {success && <p className='text-green-600 mt-2'>{success}</p>}
            {error && <p className='text-red-600 mt-2'>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
