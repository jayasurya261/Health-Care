import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrackList = () => {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [theme, setTheme] = useState('light'); // Default theme
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check and set theme from local storage
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    };

    // Fetch user data
    axios.get('http://localhost:3000/user/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setErrorMsg('Error fetching users');
        console.error('Error fetching users:', error);
      });

    // Set initial theme
    checkTheme();

    // Add event listener for storage change
    window.addEventListener('storage', checkTheme);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', checkTheme);
    };
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save to local storage
  };

  return (
    <div className={`container mx-auto pt-10 p-8 shadow-lg ${theme === 'dark' ? 'bg-[#12182d]' : 'bg-white'}`}>
      <h2 className="text-4xl font-bold text-white mb-8">User List</h2>
      <button
        onClick={toggleTheme}
        className={`mb-4 py-2 px-4 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
      {errorMsg && <p className="text-[#970202] text-lg mb-4">{errorMsg}</p>}
      
      {users.length > 0 ? (
        <table className={`table-auto w-full border-collapse border ${theme === 'dark' ? 'border-[#c9033f] bg-[#191f3d]' : 'border-gray-300 bg-white'} rounded-lg overflow-hidden shadow-md`}>
          <thead className={`${theme === 'dark' ? 'bg-[#191f3d] text-white' : 'bg-gray-200 text-black'}`}>
            <tr>
              <th className="border border-slate-500 p-4 text-left text-white text-[20px]">Name</th>
              <th className="border border-slate-500 p-4 text-left text-white text-[20px]">Email</th>
              <th className="border border-slate-500 p-4 text-left text-white text-[20px]">Latitude</th>
              <th className="border border-slate-500 p-4 text-left text-white text-[20px]">Longitude</th>
              <th className="border border-slate-500 p-4 text-left text-white text-[20px]">Map</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="transition-all duration-200 ease-in-out">
                <td className="border border-slate-500 p-4 text-white">{user.name}</td>
                <td className="border border-slate-500 p-4 text-white">{user.email}</td>
                <td className="border border-slate-500 p-4 text-white">{user.location?.latitude || 'N/A'}</td>
                <td className="border border-slate-500 p-4 text-white">{user.location?.longitude || 'N/A'}</td>
                <td className="border border-slate-500 p-4 text-white">
                  <button 
                    onClick={() => navigate(`/map/${user._id}`)}
                    className="bg-[#419ded] hover:bg-[#61b5ff] text-white font-semibold py-2 px-6 rounded-lg 
                      transition-transform transform hover:scale-105 
                      shadow-md hover:shadow-lg hover:shadow-[#61b5ff]/50"
                  >
                    View Map
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xl text-[#97022d] mt-6">No users found.</p>
      )}
    </div>
  );
};

export default TrackList;
