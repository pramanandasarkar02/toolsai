import React, { useState } from 'react';
import { 
  FaSearch, 
  FaStar, 
  FaRegStar, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaFilter,
  FaSortAmountDown
} from 'react-icons/fa';

// Mock data for available tools
const availableTools = [
  {
    id: 1,
    name: "GPT-3.5 Turbo",
    category: "Language Model",
    description: "Advanced AI model for text generation and understanding",
    rating: 4.5,
    votes: 124,
    price: 0.03,
    currency: "USD",
    unit: "per 1K tokens",
    features: ["text generation", "conversation", "coding"],
    logo: "https://openai.com/model-logo.png"
  },
  {
    id: 2,
    name: "DALL-E 2",
    category: "Image Generation",
    description: "Create realistic images and art from text descriptions",
    rating: 4.2,
    votes: 89,
    price: 0.02,
    currency: "USD",
    unit: "per image",
    features: ["image generation", "art creation", "editing"],
    logo: "https://openai.com/dalle-logo.png"
  },
  {
    id: 3,
    name: "Whisper",
    category: "Speech Recognition",
    description: "Robust speech recognition and translation model",
    rating: 4.7,
    votes: 56,
    price: 0.006,
    currency: "USD",
    unit: "per second",
    features: ["speech-to-text", "translation", "multilingual"],
    logo: "https://openai.com/whisper-logo.png"
  },
  {
    id: 4,
    name: "Codex",
    category: "Code Generation",
    description: "AI system that translates natural language to code",
    rating: 4.3,
    votes: 78,
    price: 0.04,
    currency: "USD",
    unit: "per 1K tokens",
    features: ["code generation", "autocomplete", "debugging"],
    logo: "https://openai.com/codex-logo.png"
  },
  {
    id: 5,
    name: "Claude 2",
    category: "Language Model",
    description: "Next-generation AI assistant with improved reasoning",
    rating: 4.6,
    votes: 102,
    price: 0.035,
    currency: "USD",
    unit: "per 1K tokens",
    features: ["conversation", "document analysis", "summarization"],
    logo: "https://anthropic.com/claude-logo.png"
  },
  {
    id: 6,
    name: "Stable Diffusion",
    category: "Image Generation",
    description: "Open source text-to-image generation model",
    rating: 4.1,
    votes: 145,
    price: 0.0,
    currency: "USD",
    unit: "free",
    features: ["image generation", "open source", "customizable"],
    logo: "https://stability.ai/stable-diffusion-logo.png"
  }
];

const FeedPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 0.05]);

  // Get unique categories from tools
  const categories = ['all', ...new Set(availableTools.map(tool => tool.category))];

  // Filter and sort tools
  const filteredTools = availableTools
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
      const matchesPrice = tool.price >= priceRange[0] && tool.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      if (sortOption === 'votes') return b.votes - a.votes;
      return 0;
    });

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? 
        <FaStar key={i} className="text-yellow-400 inline" /> : 
        <FaRegStar key={i} className="text-yellow-400 inline" />
      );
    }
    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Tools Marketplace</h1>
        <p className="text-gray-600">Discover and compare the best AI tools available</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tools..."
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSortAmountDown className="text-gray-400" />
            </div>
            <select
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="votes">Most Popular</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">${priceRange[0].toFixed(2)}</span>
              <input
                type="range"
                min="0"
                max="0.05"
                step="0.005"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">${priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map(tool => (
            <div key={tool.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start mb-4">
                  <img 
                    src={tool.logo} 
                    alt={`${tool.name} logo`} 
                    className="w-12 h-12 object-contain mr-3"
                  />
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{tool.name}</h2>
                    <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center mb-3">
                  <div className="mr-2">
                    {renderRatingStars(tool.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {tool.rating.toFixed(1)} ({tool.votes})
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-xl font-bold">
                    {tool.price > 0 ? `${tool.currency}${tool.price}` : 'Free'}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    {tool.unit}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {tool.features.length > 3 && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      +{tool.features.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-green-600">
                      <FaThumbsUp />
                    </button>
                    <button className="text-gray-500 hover:text-red-600">
                      <FaThumbsDown />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;