import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { images } from '../../assets/images';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../../components/reuse/general/Header';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [progressWidth, setProgressWidth] = useState(0);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false); // Added state for invalid email

  const navigate = useNavigate();

  // Handle hCaptcha token
  const handleCaptchaChange = (token) => {
    console.log('Captcha token received:', token); // Debug: Check if token is received
    setCaptchaToken(token);
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setProgressWidth(100); // Reset progress width to 100% for the new toast
    setIsToastVisible(true);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgressWidth((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - (100 / 6); // Decrease width over 6 seconds
      });
    }, 100);

    // Clear toast after 6 seconds
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
      setProgressWidth(0);
      setIsToastVisible(false);
      localStorage.setItem('type', 'user');
    }, 6000);
  };

  // Validate email using regex
  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle form submission
  const submit = () => {
    // Ensure all fields are filled and captcha is verified
    if (!email || !password || !captchaToken) {
      showToast('Please fill all fields and verify captcha.', 'error');
      return;
    }

    if (!isEmailValid(email)) {
      setIsInvalidEmail(true); // Mark email as invalid
      showToast('Invalid email format.', 'error');
      return;
    } else {
      setIsInvalidEmail(false); // Reset invalid email state if email is valid
    }

    const data = {
      email,
      password,
      captchaToken, // Include the hCaptcha token
    };

    axios
      .post('https://naturally-evident-peacock.ngrok-free.app/user/login', data)
      .then((response) => {
        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        localStorage.setItem('email', email); // Store email in localStorage
        showToast('Login successful!', 'success');
        navigate('/info');
      })
      .catch((error) => {
        console.error('Login failed:', error);
        showToast('Invalid email or password.', 'error');
      });
  };

  return (
    <>
      <Header />
      <div className='flex flex-col justify-center'>
        <div className='flex justify-between bg-slate-50 pb-[300px]'>
          <div className='ml-[200px] mt-24'>
            <div className='text-[40px] font-medium'>
              <p>Login to</p>
              <p>Connect with Care.</p>
            </div>
            <div className='mt-16'>
              <p>If you don't have an account</p>
              <p>
                you can{' '}
                <Link to='/register'>
                  <span className='text-blue-700 font-medium'>Register Here.</span>
                </Link>
              </p>
            </div>
          </div>
          <div>
            <img className='w-[500px] mt-28' src={images.fall} alt='fall' />
          </div>
          <div className='flex flex-col mr-[200px] mt-[200px]'>
            <input
              type='email'
              className={`p-2 bg-slate-100 rounded-[10px] mb-[30px] w-[300px] ${
                isInvalidEmail ? 'border-red-500 border' : ''
              }`} // Show red border if email is invalid
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isInvalidEmail && (
              <p className='text-red-500 text-sm'>Please enter a valid email address.</p>
            )}
            <input
              type='password'
              className='p-2 bg-slate-100 rounded-[10px]'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className='mt-10'>
              <HCaptcha
                sitekey='9398532e-7d12-4e8a-8fb4-4c12b6180caa' // Replace with your hCaptcha site key
                onVerify={handleCaptchaChange}
              />
            </div>

            <button
              className='text-white bg-blue-600 mt-14 p-1 rounded-lg hover:scale-105'
              onClick={submit}
            >
              Login
            </button>
          </div>

          {/* Toast Notification */}
          {isToastVisible && (
            <div className='absolute bottom-5 right-5 w-80 p-3 bg-white border rounded-lg shadow-lg border-gray-300'>
              <div
                className={`text-lg font-medium ${
                  toastType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {toastMessage}
              </div>
              <div
                className={`h-1 rounded-b-lg transition-all duration-600`}
                style={{
                  width: `${progressWidth}%`,
                  backgroundColor: toastType === 'success' ? 'green' : 'red',
                }}
              />
            </div>
          )}
        </div>
        <Link to='/admin/login'>
          <div className='flex justify-center bg-slate-50 -m-[200px]'>
            Admin <span className='text-blue-700'>Click Here!</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Login;
