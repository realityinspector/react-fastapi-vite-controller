import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Register from './components/Register'
import Welcome from './components/Welcome'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
    setShowLogin(false);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  };

  const showWelcomePage = () => {
    setShowRegister(false);
    setShowLogin(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">React FastAPI CMS</h1>
          {!token && (showLogin || showRegister) && (
            <button 
              onClick={showWelcomePage}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
        {token ? (
          <Dashboard 
            token={token} 
            isAdmin={isAdmin} 
            onLogout={handleLogout} 
          />
        ) : (
          <>
            {showLogin ? (
              <Auth onLogin={handleLogin} />
            ) : showRegister ? (
              <Register onRegister={handleRegister} />
            ) : (
              <Welcome 
                onShowLogin={() => {
                  setShowLogin(true);
                  setShowRegister(false);
                }}
                onShowRegister={() => {
                  setShowRegister(true);
                  setShowLogin(false);
                }}
              />
            )}
          </>
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
