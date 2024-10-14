import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { images } from '../assets/images';
import { useParams } from 'react-router-dom';

// Custom hook to update map view
const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const Tracking = () => {
  const [location, setLocation] = useState({ latitude: 51.505, longitude: -0.09 }); // Default coordinates
  const [errorMsg, setErrorMsg] = useState(null);
  const {_id} = useParams();

  // Define custom ambulance icon for marker
  const ambulanceIcon = new L.Icon({
    iconUrl: '../../assets/vechicle.png',  // Replace with actual path to your ambulance icon image
    iconSize: [40, 40],  // Size of the icon
    iconAnchor: [20, 40],  // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -40],  // Point where the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    // Function to fetch the GPS data
    const fetchLocation = () => {
      axios.get(`http://localhost:3000/user/api/location/${_id}`)
        .then(response => {
          const { latitude, longitude } = response.data;
          setLocation({ latitude, longitude });
        })
        .catch(error => {
          setErrorMsg('Failed to fetch location');
          console.error('Error fetching location:', error);
        });
    };

    // Fetch location every second
    const interval = setInterval(fetchLocation, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [_id]);

  return (
    <div className='w-[180vh]'>
      {/* Header Section */}
      <div className='flex justify-between border-b border-gray-600 pb-[12px]'>
        <div className='flex mt-5'>
          <input type="text" className='bg-slate-100 w-[680px] ml-20 h-8 rounded pl-2' placeholder='Search' />
          <img src={images.search} alt="" className='w-[18px] h-[18px] -ml-8 opacity-50 mt-[5px]' />
        </div>
        <div className='flex mt-5 justify-between w-[200px] mr-10'>
          <div className='flex'>
            <img src={images.profile} alt="" className='w-[35px] h-[35px]' />
            <p className='mt-2 ml-2'>Jayasurya</p>
          </div>
          <div>
            <img src={images.bell} alt="" className='w-[30px] h-[30px] mt-2 opacity-65cd' />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ height: '500px', width: '100%', marginTop: '20px' }}>
        <MapContainer center={[location.latitude, location.longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Change view when location changes */}
          <ChangeView center={[location.latitude, location.longitude]} />
          
          {/* Custom ambulance marker */}
          <Marker position={[location.latitude, location.longitude]} icon={ambulanceIcon}>
            <Popup>Your location (Ambulance)</Popup>
          </Marker>
        </MapContainer>
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Tracking;
