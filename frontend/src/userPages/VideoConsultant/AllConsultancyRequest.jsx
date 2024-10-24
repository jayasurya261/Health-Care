import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/SideBar';
import { Link } from 'react-router-dom';
import Button1 from '../../components/reuse/button1';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners'; // Import a loading spinner

const AllConsultancyRequest = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:3000/user/appointments/all/${email}`,{
          headers: {
            'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
          }
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchAppointments();
  }, [email]);

  return (
    <div className='flex'>
      <SideBar />
      <div className="container mx-auto p-4">
        <Link to='/video/request'>
          <div className='flex justify-end'>
            <Button1 contain={'New Video Appointment Booking'} />
          </div>
        </Link>
        <h1 className="text-2xl font-bold mb-4">Appointments</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]"> {/* Center the spinner */}
            <ClipLoader color="#36d7b7" loading={loading} size={50} /> {/* Loading spinner */}
          </div>
        ) : (
          <motion.table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3">Appointment ID</th>
                <th className="p-3">Doctor ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Patient ID</th>
                <th className="p-3">Video Link</th>
              </tr>
            </thead>
            <motion.tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    className="text-center border-b hover:bg-gray-100 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }} // Slight scaling effect on hover
                  >
                    <td className="p-3">{appointment._id}</td>
                    <td className="p-3">
                      {appointment.doctorId === 'doctor2' ? <p>Dr. John Snow</p> : <p>Dr. Hermione</p>}
                    </td>
                    <td className="p-3">
                      {new Date(appointment.date).toLocaleString()}
                    </td>
                    <td className="p-3">{appointment.duration} minutes</td>
                    <td className="p-3">{appointment.email}</td>
                    <td className="p-3">
                      <Link to={`/video/consultant/${appointment.videolink}`}>
                        <p className="text-blue-600 underline">Join Video</p>
                      </Link>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No appointments found
                  </td>
                </tr>
              )}
            </motion.tbody>
          </motion.table>
        )}
      </div>
    </div>
  );
};

export default AllConsultancyRequest;
