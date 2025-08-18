import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const { user, setUser } = useUser();
  const { theme } = useTheme();

  const handleLogin = async () => {
    setError('');

    if (username === '') {
      setError('Please enter a username');
      return;
    }
    if (password === '') {
      setError('Please enter a password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/signin', {
        username,
        password
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        console.log(response.data);
        navigate('/feed');         
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  // Theme-based styles
  const containerStyles = theme === 'dark' 
    ? 'bg-gray-900 text-gray-100' 
    : 'bg-gray-100 text-gray-800';

  const cardStyles = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';

  const inputStyles = theme === 'dark'
    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
    : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500';

  const buttonStyles = theme === 'dark'
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-blue-500 hover:bg-blue-600 text-white';

  const errorStyles = theme === 'dark'
    ? 'bg-red-900 text-red-100'
    : 'bg-red-100 text-red-800';

  return (
    <div className={`min-h-screen flex items-center justify-center ${containerStyles}`}>
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md border ${cardStyles}`}>
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        {error && (
          <div className={`mb-4 p-3 rounded ${errorStyles}`}>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            <FaUser className="inline mr-2" /> Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles}`}
            placeholder="Enter username"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            <FaLock className="inline mr-2" /> Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles}`}
            placeholder="Enter password"
          />
        </div>

        <button
          onClick={handleLogin}
          className={`w-full py-2 px-4 rounded-lg transition duration-300 ${buttonStyles}`}
        >
          Login
        </button>

        <p className={`mt-4 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <a 
            href="/register" 
            className={theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;