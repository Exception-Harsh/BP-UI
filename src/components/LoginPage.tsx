import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const logo = new URL("../assets/logo.png", import.meta.url).href;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(username, password)) {
      navigate('/projects');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          filter: 'blur(8px)',
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative z-10 bg-white/90 p-8 rounded-2xl shadow-2xl backdrop-blur-sm w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Company logo" className="h-24 w-auto" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <input
              type="username" placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <input
              type="password" placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}