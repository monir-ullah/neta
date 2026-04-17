import React, { useEffect, useState } from 'react';

// Define the shape of the API response
interface LocationData {
  status: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  query: string; // The user's IP address
}

const UserLocation: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // IP-API free tier uses http; if your site is https, use a proxy or pro tier
        const response = await fetch('http://ip-api.com/json/');
        const data: LocationData = await response.json();

        if (data.status === 'success') {
          setLocation(data);
        } else {
          setError('Failed to retrieve location data.');
        }

          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`;

        console.log(`Google Maps Link: ${googleMapsUrl}`);
      } catch (err) {
        setError('Error fetching location.');
        console.error(err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>User Geolocation (IP-based)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {location ? (
        <ul>
          <li><strong>IP Address:</strong> {location.query}</li>
          <li><strong>Country:</strong> {location.country}</li>
          <li><strong>City:</strong> {location.city}</li>
          <li><strong>Latitude:</strong> {location.lat}</li>
          <li><strong>Longitude:</strong> {location.lon}</li>
        </ul>
      ) : (
        !error && <p>Loading location data...</p>
      )}
    </div>
  );
};

export default UserLocation;
