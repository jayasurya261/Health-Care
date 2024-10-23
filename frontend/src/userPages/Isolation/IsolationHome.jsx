import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../../components/SideBar';
import Button1 from '../../components/reuse/button1';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import Framer Motion

const IsolationHome = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = localStorage.getItem('email');

  const navigate = useNavigate();

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
  }, [email]);

  const handleInfoClick = (request) => {
    alert(`
      Email: ${request.email}
      Illness: ${request.illness}
      Symptoms: ${request.symptoms}
      Isolation Start Date: ${new Date(request.isolationstartdate || request.createdAt).toLocaleDateString()}
      Isolation End Date: ${request.isolationenddate ? new Date(request.isolationenddate).toLocaleDateString() : 'N/A'}
    `);
    navigate(`/isolation/info/${request._id}`);
  };

  // Animation variants for row entry
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <div className="overflow-x-auto min-h-screen">
            <motion.table
              className='min-w-full bg-white border mx-auto'
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <thead>
                <tr>
                  <th className='py-2 px-4 border-b text-left'>Email</th>
                  <th className='py-2 px-4 border-b text-left'>Illness</th>
                  <th className='py-2 px-4 border-b text-left'>Symptoms</th>
                  <th className='py-2 px-4 border-b text-left'>Isolation Start Date</th>
                  <th className='py-2 px-4 border-b text-left'>Isolation End Date</th>
                  <th className='py-2 px-4 border-b text-left'>Info</th>
                </tr>
              </thead>
              <motion.tbody>
                {requests.length > 0 ? (
                  requests.map((request, index) => (
                    <motion.tr
                      key={index}
                      className='hover:bg-gray-100 transition ease-in-out duration-300 transform hover:scale-102'
                      variants={rowVariants} // Apply animation
                      // Disable hover effects on touch devices
                      whileHover={{ scale: 1.02 }} // Reduced scale to avoid zooming too much
                      whileTap={{ scale: 0.98 }}
                    >
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
                        <motion.button
                          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg'
                          onClick={() => handleInfoClick(request)}
                          whileHover={{ scale: 1.05 }} // Reduced hover scale
                          whileTap={{ scale: 0.98 }} // Tap effect
                        >
                          Info
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className='text-center py-4'>
                      No requests found
                    </td>
                  </tr>
                )}
              </motion.tbody>
            </motion.table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IsolationHome;
