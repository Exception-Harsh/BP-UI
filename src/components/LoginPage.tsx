import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const logo = new URL("../assets/logo.png", import.meta.url).href;

  useEffect(() => {
    const storedCredentials = localStorage.getItem('rememberedCredentials');
    if (storedCredentials) {
      const parsedCredentials = JSON.parse(storedCredentials);
      setUsername(parsedCredentials.username || '');
      setPassword(parsedCredentials.password || '');
      setRememberPassword(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await login(username, password)) {
      if (rememberPassword) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }
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
              type="text" placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-14 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00134B] focus:border-[#00134B]"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00134B] focus:border-[#00134B] pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-black hover:text-[#00134B] focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-700">Remember Password</label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00134B] hover:bg-[#00134B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00134B] transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}