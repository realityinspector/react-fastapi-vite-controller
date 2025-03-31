import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = '/api'; // The API URL is now proxied through Caddy

interface DashboardProps {
  token: string;
  isAdmin: boolean;
  onLogout: () => void;
}

interface UserData {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ token, isAdmin, onLogout }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.detail || 'Failed to fetch user data');
          if (err.response.status === 401) {
            // Token is invalid or expired
            onLogout();
          }
        } else {
          setError('An unexpected error occurred');
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, onLogout]);

  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {userData && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">User Information</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.is_admin ? 'Administrator' : 'Regular User'}</p>
          <p><strong>Status:</strong> {userData.is_active ? 'Active' : 'Inactive'}</p>
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Admin Panel</h2>
          <p className="text-blue-600">You have access to administrator features.</p>
          {/* Add admin-specific features here */}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 