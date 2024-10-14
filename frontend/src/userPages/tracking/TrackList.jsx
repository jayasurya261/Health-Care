import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrackList = () => {
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate= useNavigate();

  useEffect(() => {
    // Fetch user data
    axios.get('http://localhost:3000/user/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        setErrorMsg('Error fetching users');
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div className="container mx-auto mt-5">
      <h2 className="text-3xl ml-10 font-bold mb-4 ">User List</h2>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <table className="table-auto w-full border-collapse border border-gray-200 -mt-[2px]">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2">Name</th>
            <th className="border border-gray-200 p-2">Email</th>
            <th className="border border-gray-200 p-2">Latitude</th>
            <th className="border border-gray-200 p-2">Longitude</th>
            <th className="border border-gray-200 p-2">Map</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="border border-gray-200 p-2">{user.name}</td>
              <td className="border border-gray-200 p-2">{user.email}</td>
              <td className="border border-gray-200 p-2">{user.location?.latitude || 'N/A'}</td>
              <td className="border border-gray-200 p-2">{user.location?.longitude || 'N/A'}</td>
              <td className="border border-gray-200 p-2"><button onClick={()=>navigate(`/map/${user._id}`)}>Map</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
