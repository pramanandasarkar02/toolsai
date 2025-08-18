import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaRocket, FaChartLine, FaComments } from 'react-icons/fa';

const Home = () => {
  // Sample featured tools data
  const featuredTools = [
    { id: 1, name: 'ChatGPT', category: 'Chatbot', rating: 4.8 },
    { id: 2, name: 'MidJourney', category: 'Image Generation', rating: 4.7 },
    { id: 3, name: 'GitHub Copilot', category: 'Coding Assistant', rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover the Best AI Tools</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find, compare, and review thousands of AI tools to boost your productivity and creativity.
        </p>
        <div className="flex justify-center">
          <Link 
            to="/explore" 
            className="flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            <FaRocket className="mr-2" />
            Explore Tools
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Tools AI</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaSearch className="text-3xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discover</h3>
            <p className="text-gray-600">
              Find the perfect AI tools for your specific needs from our extensive database.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaStar className="text-3xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ratings & Reviews</h3>
            <p className="text-gray-600">
              See authentic user ratings and reviews to make informed decisions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FaChartLine className="text-3xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compare</h3>
            <p className="text-gray-600">
              Compare features, pricing, and performance of different AI solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Featured AI Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredTools.map((tool) => (
            <div key={tool.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-500 mb-3">{tool.category}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'} 
                  />
                ))}
                <span className="ml-2 text-gray-600">{tool.rating}</span>
              </div>
              <Link 
                to={`/tool/${tool.id}`} 
                className="inline-block mt-4 text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/explore" 
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View All Tools
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <FaComments className="text-2xl text-gray-400 mb-4" />
            <p className="text-gray-700 mb-4 italic">
              "Tools AI helped me find the perfect writing assistant that boosted my productivity by 40%!"
            </p>
            <p className="font-semibold">- Sarah, Content Creator</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <FaComments className="text-2xl text-gray-400 mb-4" />
            <p className="text-gray-700 mb-4 italic">
              "As a developer, I discovered amazing coding tools I didn't know existed. The reviews are spot on!"
            </p>
            <p className="font-semibold">- Mark, Software Engineer</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center bg-blue-50">
        <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect AI Tool?</h2>
        <div className="flex justify-center space-x-4">
          <Link 
            to="/register" 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Join Now
          </Link>
          <Link 
            to="/explore" 
            className="px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Browse Tools
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;