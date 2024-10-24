import React, { useEffect, useState } from 'react';
import { images } from '../assets/images';
import { Link, useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Set initial state from local storage
    return localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const type = localStorage.getItem('type');
    setIsAdmin(type === 'admin');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const menuItems = isAdmin 
    ? [
        { to: '/admin/track-info', img: images.info, text: 'Track Info' },
        { to: '/admin/isolation', img: images.tablet, text: 'Isolation' },
      ]
    : [
        { to: '/info', img: images.info, text: 'My Info' },
        { to: '/isolation/home', img: images.tablet, text: 'Isolation' },
        { to: '/video/all', img: images.video, text: 'Consultancy' },
      ];

  return (
    <div className={`${isDarkMode ? 'bg-[#151c39]' : 'bg-white'} w-[350px] h-screen flex flex-col justify-between shadow-lg`}>
      <div>
        <div className="flex items-center py-6 px-8 border-b border-gray-300">
          <img src={images.logo} alt="Logo" className="w-10" />
          <span className={`ml-3 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Health Care</span>
        </div>

        <div className="px-8 mt-8">
          <p className={`text-sm font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>MENU</p>
          {menuItems.map(item => (
            <Link to={item.to} key={item.text}>
              <div className={`flex items-center py-3 hover:bg-[#e62e62] rounded-md cursor-pointer transition-all ${isDarkMode ? 'bg-transparent' : 'bg-gray-100'}`}>
                <img src={item.img} className="w-5 h-5 mr-4 opacity-60" alt={item.text} />
                <p className={isDarkMode ? 'text-white' : 'text-black'}>{item.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-8 my-6">
        <label className="inline-flex items-center relative">
          <input type="checkbox" className="peer hidden" onChange={toggleTheme} checked={isDarkMode} />
          <div
            className="relative w-[110px] h-[50px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:w-[40px] after:h-[40px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] peer-checked:after:left-[55px] shadow-sm duration-300 after:duration-300"
          ></div>
          <span className={`ml-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </label>
      </div>

      <div className="px-8 mb-6">
        <button
          onClick={logout}
          className={`w-full bg-[#c9184a] hover:bg-[#9b1339] text-white py-2 rounded-md transition-all 
            shadow-sm hover:shadow-lg hover:shadow-[#ff5678]/60`}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default SideBar;
