import React from 'react';

interface WelcomeProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onShowLogin, onShowRegister }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to React FastAPI CMS</h1>
        <p className="text-xl text-gray-600">
          A modern content management system built with React and FastAPI
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Key Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Modern React frontend with Vite
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              FastAPI backend for high performance
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              PostgreSQL database integration
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              User authentication and authorization
            </li>
          </ul>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-3">Getting Started</h2>
          <p className="text-gray-700 mb-4">
            To get started with the CMS, you'll need to:
          </p>
          <ol className="space-y-2 text-gray-700 list-decimal list-inside">
            <li>Register an account (first user becomes admin)</li>
            <li>Log in with your credentials</li>
            <li>Start managing your content</li>
          </ol>
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              The first user to register will automatically become the admin user.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
        <button
          onClick={onShowRegister}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register Now
        </button>
        <button
          onClick={onShowLogin}
          className="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Welcome; 