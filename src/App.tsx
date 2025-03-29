import React, { useState } from 'react';
import Login from './components/Login';
import ContentManager from './components/ContentManager';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {token ? (
        <div>
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold">CMS Dashboard</h1>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
          <ContentManager token={token} />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
