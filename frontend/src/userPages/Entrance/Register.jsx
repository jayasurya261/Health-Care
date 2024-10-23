import React, { useState } from 'react'
import { images } from '../../assets/images'
import axios from 'axios'
import { Link } from 'react-router-dom'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Header from '../../components/reuse/general/Header';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hcaptchaToken, setCaptchaToken] = useState('');

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  function register() {
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(hcaptchaToken)

    const data = {
      name,
      email,
      password,
      hcaptchaToken,
    }
    axios.post('http://localhost:3000/user/register', data)
      .then((response) => {
        console.log("Registered Successfully")
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <Header />
      <div className='bg-slate-50 min-h-screen flex flex-col justify-center items-center'>
        <div className='container mx-auto px-4 lg:flex lg:justify-between'>
          {/* Text Section */}
          <div className='lg:w-1/2 lg:mt-[110px] lg:ml-[50px]'>
            <p className='text-3xl md:text-4xl font-semibold text-gray-800'>Register To</p>
            <p className='text-3xl md:text-4xl font-semibold text-gray-800'>Live Health! Live Happy!</p>

            <div className='mt-6 text-lg'>
              <p>If you have an account,</p>
              <Link to='/login'>
                <p>You can <span className='text-blue-700 font-medium'>Login Here</span></p>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className='hidden lg:block lg:w-1/3'>
            <img src={images.boy} alt="Boy Illustration" className='w-full mt-[100px]' />
          </div>

          {/* Form Section */}
          <div className='w-full lg:w-1/3 lg:mt-[200px] mt-10'>
            <div className='bg-white shadow-md rounded-lg p-6 space-y-6'>
              <input
                type="text"
                placeholder='Enter Name'
                className='bg-gray-100 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder='Enter Email'
                className='bg-gray-100 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder='Enter Password'
                className='bg-gray-100 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <HCaptcha
                sitekey='9398532e-7d12-4e8a-8fb4-4c12b6180caa' // Replace with your hCaptcha site key
                onVerify={handleCaptchaChange}
              />

              <button
                className='bg-blue-600 text-white py-2 w-full rounded-md hover:bg-blue-700 transition-colors'
                onClick={register}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
