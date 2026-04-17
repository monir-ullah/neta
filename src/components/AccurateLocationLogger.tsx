import React, { useEffect } from 'react';

const AccurateLocationLogger: React.FC = () => {
  useEffect(() => {
    const getPreciseLocation = () => {
      if (!("geolocation" in navigator)) {
        console.log("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

          // Output requested data to the console
          console.log(`User Latitude: ${latitude}`);
          console.log(`User Longitude: ${longitude}`);
          console.log(`Accurate within: ${accuracy} meters`);
          console.log(`Google Maps Link Acc: ${googleMapsUrl}`);
        },
        (err) => {
          console.error(`Geolocation error (${err.code}): ${err.message}`);
        },
        {
          enableHighAccuracy: true, 
          timeout: 1000000,           
          maximumAge: 0,             
        }
      );
    };

    getPreciseLocation();
  }, []);

  // Returns nothing to the UI as requested
  return null; 
};

export default AccurateLocationLogger;