import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const { theme } = useTheme();

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

  const linkStyles = theme === 'dark'
    ? 'text-blue-400 hover:text-blue-300'
    : 'text-blue-500 hover:text-blue-700';

  const handleRegister = async () => {
    setError('');
    
    if (username === '') {
      setError('Please enter a username');
      return;
    }
    if (email === '') {
      setError('Please enter an email');
      return;
    }
    if (password === '') {
      setError('Please enter a password');
      return;
    }
    if (confirmPassword === '') {
      setError('Please confirm your password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const role = 'USER';

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/signup', {
        username,
        email,
        password,
        role
      });
      
      if (response.ok) {
        navigate('/login');
      }
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${containerStyles}`}>
      <div className={`p-8 rounded-lg shadow-md w-full max-w-md border ${cardStyles}`}>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
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

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">
            <FaEnvelope className="inline mr-2" /> Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles}`}
            placeholder="Enter email"
          />
        </div>

        <div className="mb-4">
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

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">
            <FaLock className="inline mr-2" /> Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputStyles}`}
            placeholder="Confirm password"
          />
        </div>

        <button
          onClick={handleRegister}
          className={`w-full py-2 px-4 rounded-lg transition duration-300 ${buttonStyles}`}
        >
          Sign Up
        </button>

        <p className={`mt-4 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <a href="/login" className={linkStyles}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;