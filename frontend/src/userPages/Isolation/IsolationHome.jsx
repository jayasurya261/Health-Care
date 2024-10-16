import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../../components/SideBar';
import Button1 from '../../components/reuse/button1';
import { Link } from 'react-router-dom';

const IsolationHome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) {
      setError('Email not found in local storage. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/illness/my-requests/${email}`);
        setRequests(response.data);
        setLoading(false);
       
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, [email]); // Include email in dependency array

  const handleInfoClick = (request) => {
    alert(`
      Email: ${request.email}
      Illness: ${request.illness}
      Symptoms: ${request.symptoms}
      Isolation Start Date: ${new Date(request.isolationstartdate || request.createdAt).toLocaleDateString()}
      Isolation End Date: ${request.isolationenddate ? new Date(request.isolationenddate).toLocaleDateString() : 'N/A'}
    `);
  };

  return (
    <div className='flex'>
      <SideBar />
      <div className='flex flex-col p-4 w-full'>
        <Link to='/form'>
          <div className='flex justify-end'>
            <Button1 contain={'New Request'} />
          </div>
        </Link>
        <h1 className='text-3xl font-bold mb-6'>Isolation Requests</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? ( // Display error message if there is one
          <p className='text-red-500'>{error}</p>
        ) : (
          <table className='min-w-full bg-white border'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b'>Email</th>
                <th className='py-2 px-4 border-b'>Illness</th>
                <th className='py-2 px-4 border-b'>Symptoms</th>
                <th className='py-2 px-4 border-b'>Isolation Start Date</th>
                <th className='py-2 px-4 border-b'>Isolation End Date</th>
                <th className='py-2 px-4 border-b'>Info</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request, index) => (
                  <tr key={index}>
                    <td className='py-2 px-4 border-b'>{request.email}</td>
                    <td className='py-2 px-4 border-b'>{request.illness}</td>
                    <td className='py-2 px-4 border-b'>{request.symptoms}</td>
                    <td className='py-2 px-4 border-b'>
                      {new Date(request.isolationstartdate || request.createdAt).toLocaleDateString()}
                    </td>
                    <td className='py-2 px-4 border-b'>
                      {request.isolationenddate ? new Date(request.isolationenddate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className='py-2 px-4 border-b'>
                      <button 
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => handleInfoClick(request)}
                      >
                        Info
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className='text-center py-4'>
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default IsolationHome;
