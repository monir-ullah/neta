import React, { useEffect, useState } from 'react';

const LocationPlusCamera: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('');

  const fetchSnapshot = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`http://localhost:5000/snapshot?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      if (data.status === 'success') {
        setImage(data.url);
        // Google Maps URL using real device coordinates
        setMapUrl(`https://google.com{lat},${lon}`);
        console.log('Real Location Map:', `https://google.com{lat},${lon}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    const startLoop = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchSnapshot(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => console.error("Location Denied:", err.message),
        { enableHighAccuracy: true } // 🎯 Critical for GPS accuracy
      );
    };

    const intervalId = setInterval(startLoop, 5000);
    startLoop(); // Initial trigger

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Real-Time Capture & GPS Location</h2>
      {image && <img src={image} style={{ width: '600px', borderRadius: '10px' }} />}
      <p>
        <a href={mapUrl} target="_blank" rel="noreferrer">📍 View Exact Position on Google Maps</a>
      </p>
    </div>
  );
};

export default LocationPlusCamera;
