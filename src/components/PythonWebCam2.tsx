import React, { useEffect, useState } from 'react';

const PythonWebcam2: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timerId: number;

    const fetchSnapshot = async () => {
      try {
        // Request the base64 URL directly from your Python backend
        const response = await fetch('http://localhost:5000/snapshot');
        const data = await response.json();

        if (data.status === 'success') {
          // Log the image string as requested previously
          console.log('Automated Capture URL:', data.url);
          
          // Map the base64 string directly to the image state
          setImage(data.url);
          setError(null);
        } else {
          setError(data.message || 'Failed to capture frame.');
        }
      } catch (err) {
        setError('Python server unreachable. Is app.py running?');
        console.error(err);
      } finally {
        // Triggers the loop again strictly 5 seconds after the last one finished
        timerId = setTimeout(fetchSnapshot, 5000);
      }
    };

    // Trigger the very first execution immediately on mount
    fetchSnapshot();

    // Cleanup: stops the loop safely if the user navigates away or closes the tab
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>📸 Python Automated Capture</h2>
      <p style={{ color: 'orange', fontWeight: 'bold' }}>
        🔄 Refreshing live frames every 5 seconds...
      </p>

      {error && (
        <div style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
          ❌ Error: {error}
        </div>
      )}

      {image ? (
        <div style={{ marginTop: '20px' }}>
          <h3>Latest Captured Image:</h3>
          <img 
            src={image} 
            alt="Captured Camera Feed" 
            style={{ 
              width: '640px', 
              maxWidth: '100%', 
              borderRadius: '12px', 
              display: 'none', // Hide the image until it fully loads to prevent flashes
              border: '3px solid #ddd',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      ) : (
        !error && (
          <p style={{ color: '#666', marginTop: '20px' }}>
            Waiting for first camera frame...
          </p>
        )
      )}
    </div>
  );
};

export default PythonWebcam2;
