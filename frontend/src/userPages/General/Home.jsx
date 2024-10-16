import React, { useEffect, useState } from 'react';
import { images } from '../../assets/images';
import { Link } from 'react-router-dom';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [textIndex2, setTextIndex2] = useState(0);
  const [projectTextIndex, setProjectTextIndex] = useState(0); // For project message typing effect

  const message = "Health plays a crucial role in the academic success of students. Physical and mental well-being directly influence a student's ability to focus.";
  const message2 = "Your health is your greatest asset; nurture it with care. Prioritize self-care today to pave the way for a brighter tomorrow.";
  const projectMessage = "Ambulance tracking via student mobile. Isolation alert and request for students. Online pharmacy for student health.";

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Typing animation for the first message
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex < message.length ? prevIndex + 1 : prevIndex));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Typing animation for the second message
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex2((prevIndex) => (prevIndex < message2.length ? prevIndex + 1 : prevIndex));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Typing animation for the project message
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectTextIndex((prevIndex) => (prevIndex < projectMessage.length ? prevIndex + 1 : prevIndex));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate opacity and image size scaling based on scroll
  const imageHeight = 500; // Base height of the image
  const minHeight = 200; // Minimum height as it shrinks
  const scaleFactor = Math.max(minHeight, imageHeight - scrollY); // Shrink the height on scroll
  const opacity = Math.max(0, 1 - scrollY / imageHeight); // Fade out header with scroll

  return (
    <div className='flex flex-col mb-20'>
      {/* Header with opacity based on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 flex flex-col items-center justify-center transition-opacity duration-300 z-50`}
        style={{ opacity }}>
        <h1 className={`text-4xl md:text-6xl font-bold mt-12 text-white`}>
          Health Care
        </h1>
        <p className={`text-lg md:text-xl text-white mt-2`}>
          Your health matters, especially in college!
        </p>
      </header>

      <div className='mt-0'>
        {/* Image that shrinks with scroll */}
        <div className="relative overflow-hidden">
          <img 
            src={images.home} 
            alt="Home" 
            style={{
              height: `100vh`, 
              width: '100%', 
              transition: 'height 0.3s ease'
            }} 
          />
        </div>
      </div>

      {/* First section with image and text */}
      <div className='flex items-center mt-10'>
        <div className='mr-8 ml-20 rounded-[20px] transition-opacity duration-300'>
          <img src={images.girl1} alt="Girl" className='w-80 rounded-[20px]' />
        </div>
        <div className='ml-8'>
          <p className='text-lg font-bold flex'>
            {message.slice(0, textIndex)}
            {textIndex < message.length && <span className="blinking-cursor">|</span>}
          </p>
        </div>
      </div>

      {/* Second section with reversed layout */}
      <div className='flex flex-row-reverse items-center mt-10'>
        <div className='ml-8 mr-20 rounded-[20px] transition-opacity duration-300'>
          <img src={images.boy1} alt="Boy" className='w-80 rounded-[20px]' />
        </div>
        <div className='mr-8'>
          <p className='text-lg font-bold'>
            {message2.slice(0, textIndex2)}
            {textIndex2 < message2.length && <span className="blinking-cursor">|</span>}
          </p>
        </div>
      </div>

      {/* Fourth section with big image, centered text, and button */}
      <div className="relative mt-10">
        <img 
          src={images.classroom} 
          alt="Classroom" 
          style={{
            height: '100vh', 
            width: '100%', 
            objectFit: 'cover', 
            position: 'relative'
          }} 
        />
        {/* Add dark sandal bottom border */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[10px]" 
          style={{ backgroundColor: '#8B5A2B' }} 
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-4xl md:text-5xl text-white font-bold text-center mb-4">
            {projectMessage.slice(0, projectTextIndex)}
            {projectTextIndex < projectMessage.length && <span className="blinking-cursor">|</span>}
          </p>
         <Link to='/login'>
         <button className="text-lg md:text-2xl bg-[#eab676] text-white py-4 px-8 rounded-lg font-semibold shadow-lg hover:bg-[#efa64a] transition-colors">
            Get Started
          </button>
         </Link>
        </div>
      </div>
      <div className='flex  justify-center text-3xl '>
      <div className='mt-20'>
        <p>Developed By</p>
       
      </div>
      
      </div>
      <div className='flex'>
      <div>
      <img src={images.friends} alt=""  className='w-[400px]  rounded-[20px] ml-20 shadow-2xl'/>
      </div>
      <div className='ml-20 bg-slate-100 p-10 shadow-2xl rounded-[20px] h-[250px] mt-20'>
        <p className='w-[1000px] '>We are a passionate and skilled team of developers and designers committed to creating innovative solutions. Jayasurya R, our fullstack developer, specializes in building robust backends and dynamic interfaces. Keerthika R is our frontend developer and presenter, bringing fresh perspectives and solutions to every challenge, ensuring our designs are both responsive and user-friendly. Hariramji, our frontend developer and UI/UX designer, crafts intuitive user experiences that blend functionality with aesthetics. Together, we strive to deliver impactful projects that make a difference.</p>
        <p className='mt-5 text-xl  font-italianno'>Code is like poetry; every line you write is a part of your masterpiece. ❤️❤️❤️</p>
      </div>
      
      </div>
    </div>
  );
};

export default Home;
