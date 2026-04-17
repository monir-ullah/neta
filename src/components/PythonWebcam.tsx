import React, { useEffect, useRef, useState } from 'react';

const PythonWebcam: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    // 🔥 Captures the picture directly from the live <img> stream
    const captureImageFromStream = () => {
      if (imgRef.current && canvasRef.current) {
        const img = imgRef.current;
        const canvas = canvasRef.current;

        // Verify the image stream has actively resolved width signals
        if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

        // Sync canvas map dimensions directly to the video feed grid
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw the current active pixel frame from the <img> tag
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Generate the base64 URL string
          const dataUrl = canvas.toDataURL('image/png');

          console.log('Successfully Captured Image from Python Stream:', dataUrl);
          setImage(dataUrl);
        }
      }
    };

    // Auto-capture every 5 seconds
    const intervalId = setInterval(captureImageFromStream, 5000);

    // Cleanup memory traces on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Python Powered Webcam Feed</h2>
      <p style={{ color: '#666' }}>
        This stream is running through Python OpenCV. No browser permission required!
      </p>

      <div style={{ marginTop: '15px' }}>
        {/* Pass the reference to the image tag */}
        <img 
          ref={imgRef}
          src="http://localhost:5000/video_feed" 
          alt="Live Camera Feed" 
          style={{ width: '640px', borderRadius: '8px', border: '1px solid #ddd' }} 
        />
      </div>

      {/* Hidden canvas used to draw and extract base64 data */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {image && (
        <div style={{ marginTop: '20px' }}>
          <h3>Latest Automatic Capture:</h3>
          <img src={image} alt="Captured" style={{ width: '320px', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default PythonWebcam;
