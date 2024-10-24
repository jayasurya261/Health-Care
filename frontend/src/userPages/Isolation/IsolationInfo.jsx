import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideBar from '../../components/SideBar';

const IsolationInfo = () => {
  const [response, setResponse] = useState({});
  const [profileData, setProfileData] = useState({});
  const { _id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [permissionGranted, setPermissionGranted] = useState(false); // State to handle permission

  console.log(_id);
  const token = localStorage.getItem('token');

  // Get user type from localStorage (user or admin)
  useEffect(() => {
    const userType = localStorage.getItem('type'); // assuming 'userType' is stored in localStorage
    if (userType === 'admin') {
      setIsAdmin(true); // If the user is an admin, enable admin controls
    }
  }, []);

  // First API call to get isolation info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3000/user/illness/request-info/${_id}`,{
          headers: {
            'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
          }
        });
        console.log(result.data);
        setResponse(result.data);
        setPermissionGranted(result.data.isolated); // Set the initial permission status

        // Trigger second API call once the email is available
        if (result.data.email) {
          fetchProfileData(result.data.email);
        }
      } catch (error) {
        console.error('Error fetching isolation request info:', error);
      }
    };
    fetchData();
  }, [_id]);

  // Second API call to get user profile based on email
  const fetchProfileData = async (email) => {
    try {
      const result = await axios.get(`http://localhost:3000/user/profile/${email}`,{
        headers: {
          'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
        }
      });
      console.log('Profile Data:', result.data);
      setProfileData(result.data); // Store profile data in separate state
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Handle permission change by admin
  const handlePermissionChange = async () => {
    try {
      // Update the permission status in the backend
      await axios.put(`http://localhost:3000/user/illness/update-permission/${_id}`,{
        headers: {
          'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
        }
      }, {
        isolated: !permissionGranted, // Toggle the permission
      });
      
      // Update the state to reflect the new permission
      setPermissionGranted(!permissionGranted);
      alert('Permission status updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      alert('Failed to update permission');
    }
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='flex justify-center ml-[400px] mt-[50px]'>
        <div className='flex justify-center flex-col bg-slate-100 p-20 rounded-[20px] mt-20 pl-32 pr-32'>
          <p className='text-3xl mb-10'>Isolation Request Info</p>
          <div className='flex mb-5'>
            <p>Name: </p>
            <p>{profileData.name || 'N/A'}</p> {/* Use profileData for the name */}
          </div>
          <div className='flex mb-5'>
            <p>Email: </p>
            <p>{response.email || 'N/A'}</p> {/* Use response for email */}
          </div>
          <div className='flex mb-5'>
            <p>Illness: </p>
            <p>{response.illness || 'N/A'}</p>
          </div>
          <div className='flex mb-5'>
            <p>Symptoms: </p>
            <p>{response.symptoms || 'N/A'}</p>
          </div>
          <div className='flex mb-5'>
            <p>Permission: </p>
            <p>{permissionGranted ? 'Granted' : 'Not Granted Yet'}</p>
          </div>
          <div className='flex mb-5'>
            <p>Isolation Start Date: </p>
            <p>{response.updatedAt || 'N/A'}</p>
          </div>
          <div className='flex mb-5'>
            <p>Isolation End Date: </p>
            <p>{response.isolationenddate || 'N/A'}</p>
          </div>

          {/* Conditional rendering for admin to change the permission */}
          {isAdmin && (
            <div className='mt-5'>
              <button
                className={`${
                  permissionGranted ? 'bg-red-500' : 'bg-green-500'
                } text-white py-2 px-4 rounded`}
                onClick={handlePermissionChange}
              >
                {permissionGranted ? 'Revoke Permission' : 'Grant Permission'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IsolationInfo;
