import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  FiHome, FiUser, FiSearch, FiBell, FiHeart, FiMessageCircle, 
  FiStar, FiEye, FiTag, FiPlus, FiEdit3, FiTrash2, FiSettings,
  FiLogIn, FiLogOut, FiUserPlus, FiFilter, FiGrid, FiList,
  FiChevronDown, FiChevronUp, FiX, FiCheck, FiExternalLink,
  FiBuilding, FiTrendingUp, FiClock, FiUsers, FiBox
} from 'react-icons/fi';

// Context for global state management
const AppContext = createContext();

const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Service
class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // User endpoints
  static async registerUser(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async loginUser(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async getUser(userId) {
    return this.request(`/users/${userId}`);
  }

  // Organization endpoints
  static async getOrganizations(page = 0, size = 10) {
    return this.request(`/organizations?page=${page}&size=${size}`);
  }

  static async createOrganization(orgData) {
    return this.request('/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  }

  // AI Model endpoints
  static async getModels(page = 0, size = 12, sort = 'createdAt,desc') {
    return this.request(`/models?page=${page}&size=${size}&sort=${sort}`);
  }

  static async getModel(modelId) {
    return this.request(`/models/${modelId}`);
  }

  static async createModel(modelData) {
    return this.request('/models', {
      method: 'POST',
      body: JSON.stringify(modelData),
    });
  }

  static async searchModels(query, page = 0, size = 12) {
    return this.request(`/models/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  }

  static async getFeaturedModels(page = 0, size = 12) {
    return this.request(`/models/featured?page=${page}&size=${size}`);
  }

  static async getMostViewedModels(limit = 10) {
    return this.request(`/models/trending/most-viewed?limit=${limit}`);
  }

  static async getMostLikedModels(limit = 10) {
    return this.request(`/models/trending/most-liked?limit=${limit}`);
  }

  static async getTopRatedModels(limit = 10) {
    return this.request(`/models/trending/top-rated?limit=${limit}`);
  }

  // Comment endpoints
  static async getModelComments(modelId, page = 0, size = 10) {
    return this.request(`/models/${modelId}/comments?page=${page}&size=${size}`);
  }

  static async createComment(modelId, userId, content) {
    return this.request(`/models/${modelId}/comments?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Like endpoints
  static async toggleLike(modelId, userId) {
    return this.request(`/models/${modelId}/likes/toggle?userId=${userId}`, {
      method: 'POST',
    });
  }

  static async checkLike(modelId, userId) {
    return this.request(`/models/${modelId}/likes/check?userId=${userId}`);
  }

  // Rating endpoints
  static async createRating(modelId, userId, rating, review) {
    return this.request(`/models/${modelId}/ratings?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  }

  static async getModelRatings(modelId, page = 0, size = 10) {
    return this.request(`/models/${modelId}/ratings?page=${page}&size=${size}`);
  }

  // Tag endpoints
  static async getTags(page = 0, size = 20) {
    return this.request(`/tags?page=${page}&size=${size}`);
  }

  static async getPopularTags(limit = 20) {
    return this.request(`/tags/popular?limit=${limit}`);
  }

  // Notification endpoints
  static async getNotifications(userId, page = 0, size = 20) {
    return this.request(`/users/${userId}/notifications?page=${page}&size=${size}`);
  }

  static async getUnreadCount(userId) {
    return this.request(`/users/${userId}/notifications/unread/count`);
  }
}

// App Provider Component
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
      loadUnreadCount(userData.id);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await ApiService.loginUser(credentials);
      const userData = response.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      
      await loadUnreadCount(userData.id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await ApiService.registerUser(userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setCurrentPage('home');
  };

  const loadUnreadCount = async (userId) => {
    try {
      const response = await ApiService.getUnreadCount(userId);
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    currentPage,
    setCurrentPage,
    loading,
    setLoading,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    login,
    register,
    logout,
    loadUnreadCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Header Component
const Header = () => {
  const { user, isAuthenticated, currentPage, setCurrentPage, logout, unreadCount } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('search');
    }
  };

  const navItems = [
    { key: 'home', label: 'Home', icon: FiHome },
    { key: 'models', label: 'Models', icon: FiBox },
    { key: 'organizations', label: 'Organizations', icon: FiBuilding },
    { key: 'trending', label: 'Trending', icon: FiTrendingUp },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" 
                  onClick={() => setCurrentPage('home')}>
                ToolsAI
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === key
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI models..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setCurrentPage('notifications')}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FiBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser size={16} />
                    </div>
                    <span className="hidden md:block text-sm font-medium">{user?.username}</span>
                    <FiChevronDown size={14} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="inline mr-2" size={14} />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('settings');
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings className="inline mr-2" size={14} />
                        Settings
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="inline mr-2" size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FiLogIn size={20} />
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Login Component
const LoginForm = () => {
  const { login, setCurrentPage, loading } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData);
    if (result.success) {
      setCurrentPage('home');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Access your ToolsAI account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('register')}
            className="text-blue-600 hover:text-blue-500"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = () => {
  const { register, setCurrentPage, loading } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setCurrentPage('login'), 2000);
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center p-8">
          <FiCheck className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join the ToolsAI community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Choose a username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password (min 8 characters)"
              minLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio (Optional)</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

// Model Card Component
const ModelCard = ({ model, onLike, onViewDetails }) => {
  const { user, isAuthenticated } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(model.likeCount || 0);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkLikeStatus();
    }
  }, [model.id, user]);

  const checkLikeStatus = async () => {
    try {
      const response = await ApiService.checkLike(model.id, user.id);
      setLiked(response.data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await ApiService.toggleLike(model.id, user.id);
      const newLiked = response.data;
      setLiked(newLiked);
      setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
      if (onLike) onLike(model.id, newLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getPricingDisplay = () => {
    if (model.pricingType === 'FREE') return 'Free';
    if (model.pricingType === 'FREEMIUM') return 'Freemium';
    if (model.modelPrice) {
      return `$${model.modelPrice}${model.pricingUnit ? ` ${model.pricingUnit}` : ''}`;
    }
    return model.pricingType;
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails(model)}
    >
      {model.modelImageUrl && (
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <img
            src={model.modelImageUrl}
            alt={model.modelName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('hidden');
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {model.modelName}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            model.pricingType === 'FREE' 
              ? 'bg-green-100 text-green-800'
              : model.pricingType === 'FREEMIUM'
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {getPricingDisplay()}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {model.modelDescription}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <FiBuilding className="mr-1" size={14} />
            {model.organization?.orgName || 'Unknown'}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {model.modelCategory?.replace(/_/g, ' ')}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <FiEye className="mr-1" size={14} />
              {model.viewCount || 0}
            </span>
            <span className="flex items-center">
              <FiMessageCircle className="mr-1" size={14} />
              {model.commentCount || 0}
            </span>
            {model.averageRating && (
              <span className="flex items-center">
                <FiStar className="mr-1 text-yellow-500" size={14} />
                {Number(model.averageRating).toFixed(1)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              liked 
                ? 'text-red-600 bg-red-50' 
                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
          >
            <FiHeart className={liked ? 'fill-current' : ''} size={16} />
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
        
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {model.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                #{tag.name}
              </span>
            ))}
            {model.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{model.tags.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Model Details Modal
const ModelDetailsModal = ({ model, isOpen, onClose }) => {
  const { user, isAuthenticated } = useAppContext();
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState({ rating: 5, review: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && model) {
      loadComments();
      loadRatings();
    }
  }, [isOpen, model]);

  const loadComments = async () => {
    try {
      const response = await ApiService.getModelComments(model.id);
      setComments(response.data.content || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadRatings = async () => {
    try {
      const response = await ApiService.getModelRatings(model.id);
      setRatings(response.data.content || []);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;

    try {
      setLoading(true);
      await ApiService.createComment(model.id, user.id, newComment);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRating = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      await ApiService.createRating(model.id, user.id, newRating.rating, newRating.review);
      setNewRating({ rating: 5, review: '' });
      await loadRatings();
    } catch (error) {
      console.error('Error adding rating:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{model.modelName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex border-b">
          {['overview', 'comments', 'ratings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Model Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Version:</span> {model.modelVersion}</div>
                    <div><span className="font-medium">Category:</span> {model.modelCategory?.replace(/_/g, ' ')}</div>
                    <div><span className="font-medium">Organization:</span> {model.organization?.orgName}</div>
                    <div><span className="font-medium">Pricing:</span> {model.pricingType}</div>
                    {model.modelPrice && (
                      <div><span className="font-medium">Price:</span> ${model.modelPrice} {model.pricingUnit}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-2xl font-bold text-blue-600">{model.viewCount || 0}</div>
                      <div className="text-gray-600">Views</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-2xl font-bold text-red-600">{model.likeCount || 0}</div>
                      <div className="text-gray-600">Likes</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-2xl font-bold text-green-600">{model.commentCount || 0}</div>
                      <div className="text-gray-600">Comments</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-2xl font-bold text-yellow-600">
                        {model.averageRating ? Number(model.averageRating).toFixed(1) : 'N/A'}
                      </div>
                      <div className="text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{model.modelDescription}</p>
              </div>

              {model.tags && model.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {model.apiUrl && (
                  <a
                    href={model.apiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    <FiExternalLink size={16} />
                    <span>API Access</span>
                  </a>
                )}
                {model.documentationUrl && (
                  <a
                    href={model.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <FiExternalLink size={16} />
                    <span>Documentation</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              {isAuthenticated && (
                <form onSubmit={handleAddComment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add a comment</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Share your thoughts about this model..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiUser size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {comment.user?.username || 'Anonymous'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              {isAuthenticated && (
                <form onSubmit={handleAddRating} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <select
                        value={newRating.rating}
                        onChange={(e) => setNewRating({ ...newRating, rating: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[5, 4, 3, 2, 1].map(num => (
                          <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review (Optional)</label>
                      <textarea
                        value={newRating.review}
                        onChange={(e) => setNewRating({ ...newRating, review: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Share your experience..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {ratings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No ratings yet. Be the first to rate!</p>
                ) : (
                  ratings.map((rating) => (
                    <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <FiUser size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {rating.user?.username || 'Anonymous'}
                            </span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <FiStar
                                  key={i}
                                  size={14}
                                  className={i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.review && <p className="text-gray-700">{rating.review}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const { setCurrentPage } = useAppContext();
  const [featuredModels, setFeaturedModels] = useState([]);
  const [trendingModels, setTrendingModels] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [featured, trending, tags] = await Promise.all([
        ApiService.getFeaturedModels(0, 8),
        ApiService.getMostViewedModels(6),
        ApiService.getPopularTags(10)
      ]);
      
      setFeaturedModels(featured.data.content || []);
      setTrendingModels(trending.data || []);
      setPopularTags(tags.data || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover AI Models
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Explore, compare, and integrate the latest AI models for your projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('models')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Models
            </button>
            <button
              onClick={() => setCurrentPage('organizations')}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Organizations
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Models */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Models</h2>
            <button
              onClick={() => setCurrentPage('models')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredModels.slice(0, 8).map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </section>

        {/* Trending Models */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
            <button
              onClick={() => setCurrentPage('trending')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View Trending →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingModels.slice(0, 6).map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </section>

        {/* Popular Tags */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setCurrentPage('models')}
                className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <span className="font-medium">#{tag.name}</span>
                <span className="text-gray-500 ml-2">({tag.usageCount})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">AI Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">25K+</div>
              <div className="text-gray-600">API Calls</div>
            </div>
          </div>
        </section>
      </div>

      <ModelDetailsModal
        model={selectedModel}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

// Models Page Component
const ModelsPage = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    pricingType: '',
    sortBy: 'createdAt,desc'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadModels();
  }, [page, filters]);

  const loadModels = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery.trim()) {
        response = await ApiService.searchModels(searchQuery, page, 12);
      } else {
        response = await ApiService.getModels(page, 12, filters.sortBy);
      }
      
      setModels(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    loadModels();
  };

  const handleViewDetails = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const categories = [
    'LANGUAGE_MODEL', 'COMPUTER_VISION', 'AUDIO_PROCESSING', 'TEXT_TO_SPEECH',
    'SPEECH_TO_TEXT', 'IMAGE_GENERATION', 'VIDEO_PROCESSING', 'NATURAL_LANGUAGE_PROCESSING'
  ];

  const pricingTypes = ['FREE', 'FREEMIUM', 'PAID', 'SUBSCRIPTION', 'PAY_PER_USE'];
  const sortOptions = [
    { value: 'createdAt,desc', label: 'Newest First' },
    { value: 'viewCount,desc', label: 'Most Viewed' },
    { value: 'likeCount,desc', label: 'Most Liked' },
    { value: 'averageRating,desc', label: 'Highest Rated' },
    { value: 'modelName,asc', label: 'Name A-Z' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Models</h1>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search models by name or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>

            <select
              value={filters.pricingType}
              onChange={(e) => setFilters({ ...filters, pricingType: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Pricing</option>
              {pricingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Models Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading models...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {models.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">No models found</p>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ModelDetailsModal
        model={selectedModel}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

// Organizations Page Component
const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadOrganizations();
  }, [page]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getOrganizations(page, 12);
      setOrganizations(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Organizations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {organizations.map((org) => (
            <div key={org.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.orgName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <FiBuilding size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{org.orgName}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{org.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <FiBox className="mr-1" size={14} />
                      {org.totalModels || 0} models
                    </span>
                    <span className="flex items-center">
                      <FiUsers className="mr-1" size={14} />
                      {org.totalSubscribers || 0} followers
                    </span>
                  </div>
                  <div className="mt-4">
                    <a
                      href={org.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <FiExternalLink className="mr-1" size={14} />
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {organizations.length === 0 && (
          <div className="text-center py-12">
            <FiBuilding className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No organizations found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Trending Page Component
const TrendingPage = () => {
  const [mostViewed, setMostViewed] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('viewed');

  useEffect(() => {
    loadTrendingData();
  }, []);

  const loadTrendingData = async () => {
    try {
      setLoading(true);
      const [viewed, liked, rated] = await Promise.all([
        ApiService.getMostViewedModels(20),
        ApiService.getMostLikedModels(20),
        ApiService.getTopRatedModels(20)
      ]);
      
      setMostViewed(viewed.data || []);
      setMostLiked(liked.data || []);
      setTopRated(rated.data || []);
    } catch (error) {
      console.error('Error loading trending data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const getCurrentModels = () => {
    switch (activeTab) {
      case 'liked': return mostLiked;
      case 'rated': return topRated;
      default: return mostViewed;
    }
  };

  const tabs = [
    { key: 'viewed', label: 'Most Viewed', icon: FiEye },
    { key: 'liked', label: 'Most Liked', icon: FiHeart },
    { key: 'rated', label: 'Top Rated', icon: FiStar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Trending Models</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trending models...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getCurrentModels().map((model, index) => (
              <div key={model.id} className="relative">
                <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-10">
                  #{index + 1}
                </div>
                <ModelCard
                  model={model}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && getCurrentModels().length === 0 && (
          <div className="text-center py-12">
            <FiTrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No trending models found</p>
          </div>
        )}
      </div>

      <ModelDetailsModal
        model={selectedModel}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

// Notifications Page Component
const NotificationsPage = () => {
  const { user, isAuthenticated } = useAppContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    }
  }, [isAuthenticated, user, page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getNotifications(user.id, page, 20);
      setNotifications(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Please sign in to view notifications</p>
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border p-4 ${
                    !notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <FiBell size={16} className={!notification.isRead ? 'text-blue-600' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                        {!notification.isRead && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <FiBell className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No notifications yet</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Profile Page Component
const ProfilePage = () => {
  const { user, isAuthenticated, setCurrentPage } = useAppContext();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Please sign in to view your profile</p>
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover rounded-full" />
              ) : (
                <FiUser size={32} className="text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName || user.username}</h1>
              <p className="text-gray-600">@{user.username}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Role:</span>
                  <p className="text-gray-900">{user.role}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Verified:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700">
                {user.bio || 'No bio available.'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentPage('settings')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSettings size={16} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setCurrentPage('models')}
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiBox size={16} />
                <span>Browse Models</span>
              </button>
              <button
                onClick={() => setCurrentPage('notifications')}
                className="flex items-center space-x-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiBell size={16} />
                <span>View Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Page Component
const SettingsPage = () => {
  const { user, isAuthenticated, setCurrentPage } = useAppContext();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiSettings className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Please sign in to access settings</p>
          <button
            onClick={() => setCurrentPage('login')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-8">
            {/* Profile Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <div className="text-center py-12 text-gray-500">
                <FiSettings size={48} className="mx-auto mb-4" />
                <p>Profile editing functionality would be implemented here</p>
                <p className="text-sm mt-2">This would include forms to update user information, avatar, bio, etc.</p>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="text-center py-12 text-gray-500">
                <FiBell size={48} className="mx-auto mb-4" />
                <p>Notification settings would be implemented here</p>
                <p className="text-sm mt-2">This would include toggles for different types of notifications</p>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>
              <div className="text-center py-12 text-gray-500">
                <FiUser size={48} className="mx-auto mb-4" />
                <p>Privacy and security settings would be implemented here</p>
                <p className="text-sm mt-2">This would include password change, API keys management, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { currentPage } = useAppContext();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm />;
      case 'register':
        return <RegisterForm />;
      case 'models':
        return <ModelsPage />;
      case 'organizations':
        return <OrganizationsPage />;
      case 'trending':
        return <TrendingPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{renderCurrentPage()}</main>
    </div>
  );
};

// Root Component with Provider
const ToolsAIApp = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default ToolsAIApp;