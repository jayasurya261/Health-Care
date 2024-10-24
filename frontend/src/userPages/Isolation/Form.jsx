import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../../components/SideBar';
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [symptoms, setSymptoms] = useState('');
  const [illness, setIllness] = useState('');
  const [days, setDays] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedToken = localStorage.getItem('token');
    if (storedEmail) {
      setEmail(storedEmail); // Automatically set email from localStorage
    }
    if (storedToken) {
      setToken(storedToken); // Automatically set token from localStorage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      email, // Use email from localStorage
      symptoms,
      isolated: true, // Assuming isolation status is true by default
      illness,
      isolationenddate: new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000), // Calculating isolation end date based on entered days
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/user/illness/form',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      console.log('Form submitted successfully:', response.data);
      navigate('/isolation/home');
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  return (
    <div className='flex'>
      <SideBar></SideBar>
      <div className='flex justify-center w-[200vh] mt-20'>
        <div className='flex justify-center bg-slate-200 h-[400px] p-4 rounded-[20px] pl-20 pr-20'>
          <div>
            <p className='text-3xl font-medium'>Isolation Request Form</p>
            <form className='flex flex-col' onSubmit={handleSubmit}>
              <input
                type="text"
                className='mb-10 p-2 rounded-[10px]'
                placeholder='Enter Symptoms'
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <input
                type="text"
                className='mb-10 p-2 rounded-[10px]'
                placeholder='Enter the name of illness'
                value={illness}
                onChange={(e) => setIllness(e.target.value)}
              />
              <input
                type="number"
                placeholder='How many days'
                className='p-2 rounded-[10px]'
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <button type='submit' className='mt-5 bg-blue-600 p-2 rounded-[10px] text-white'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
