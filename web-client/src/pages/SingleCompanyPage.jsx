import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { BsBoxSeam } from 'react-icons/bs';

const SingleCompanyPage = () => {
  const { id } = useParams();
  // In a real app, you would fetch the company data based on the ID
  // For this example, we'll use the mock data
  const company = singleCompany;
  const navigate = useNavigate();
  const handleTryDemo = (model_name) => {
    // Handle the "Try Demo" button click here
    navigate('/tools/' + model_name);
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img 
              src={company.company_logo} 
              alt={company.name} 
              className="w-20 h-20 object-contain rounded-lg border border-gray-200"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">{company.description}</p>
              <div className="flex items-center mt-3 text-gray-500">
                <FaMapMarkerAlt className="mr-1" />
                <span>{company.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Models Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Models</h2>
          
          <div className="space-y-4">
            {company.models.map((model, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                      <p className="text-gray-600 mt-1">{model.description}</p>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                          <BsBoxSeam className="text-blue-500 mr-1" />
                          <span className="text-sm text-blue-600">{model.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-xl font-bold text-gray-900">
                        {model.price.toFixed(2)} {model.currency}
                      </div>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < Math.floor(model.ratting) ? 'text-yellow-400' : 'text-gray-300'} w-4 h-4`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-gray-500">({model.ratting})</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">FEATURES</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {model.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <FaChevronRight className="text-blue-500 w-3 h-3 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150" onClick={() => handleTryDemo(model.slug)}>
                    Try Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data (would normally come from an API or data.json)
const singleCompany = {
  "name": "Tech Innovations Inc.",
  "description": "Leading provider of AI solutions for modern businesses.",
  "location": "San Francisco, CA",
  "company_logo": "https://via.placeholder.com/150",
  "models": [
    {
      "name": "AI Pro",
      "slug": "ai-pro",
      "description": "Advanced AI model for enterprise solutions with high accuracy.",
      "type": "Premium",
      "price": 299.99,
      "currency": "USD",
      "features": ["Real-time processing", "Multi-language support", "API access", "24/7 support"],
      "ratting": 4.7    
    },
    {
      "name": "AI Basic",
      "slug": "ai-basic",
      "description": "Entry-level AI model for small businesses and startups.",
      "type": "Standard",
      "price": 99.99,
      "currency": "USD",
      "features": ["Batch processing", "English support", "Community forum access"],
      "ratting": 4.2    
    }
  ]
};

export default SingleCompanyPage;