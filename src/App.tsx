import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Register from './components/Register'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check if the user is logged in on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Try to get isAdmin from localStorage, default to false
      const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const handleLogin = (newToken: string, admin: boolean) => {
    setToken(newToken);
    setIsAdmin(admin);
    localStorage.setItem('token', newToken);
    localStorage.setItem('isAdmin', admin.toString());
  };

  const handleRegister = (newToken: string, admin: boolean) => {
    handleLogin(newToken, admin);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">React FastAPI CMS</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {token ? (
          <Dashboard 
            token={token} 
            isAdmin={isAdmin} 
            onLogout={handleLogout} 
          />
        ) : (
          <div>
            {showRegister ? (
              <Register onRegister={handleRegister} />
            ) : (
              <Auth onLogin={handleLogin} />
            )}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowRegister(!showRegister)}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                {showRegister ? 'Already have an account? Login' : 'Need an account? Register'}
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white mt-auto py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} React FastAPI CMS</p>
        </div>
      </footer>
    </div>
  )
}

export default App
