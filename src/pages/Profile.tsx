import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface ProfileData {
  displayName: string;
  username: string;
  email: string;
  password: string;
  isDisabled: boolean;
  phoneNumber: string;
  address: string;
}

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    username: '',
    email: '',
    password: '',
    isDisabled: false,
    phoneNumber: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get('https://localhost:7135/api/Auth/Me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setProfileData(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create update data object with empty strings for unfilled fields
      const updateData = {
        displayName: profileData.displayName || '',
        phoneNumber: profileData.phoneNumber || '',
        password: profileData.password || '',
        address: profileData.address || ''
      };

      await axios.put('https://localhost:7135/api/User/UpdateUser', updateData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Hồ sơ cá nhân</h2>
                <button
                  className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-4`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="displayName" className="form-label">Tên hiển thị</label>
                  <input
                    type="text"
                    className="form-control"
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={profileData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="••••••••"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {isEditing && (
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 