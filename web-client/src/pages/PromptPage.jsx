import React, { useState } from 'react';
import { FiCopy, FiThumbsUp, FiThumbsDown, FiSend } from 'react-icons/fi';
import { BsLightbulb, BsLightbulbOff } from 'react-icons/bs';

const PromptPage = ({ modelName = "GPT-3.5 Turbo" }) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('output');

  const examplePrompts = [
    "Write a professional email to decline a meeting invitation",
    "Create a Python function to calculate Fibonacci sequence",
    "Explain quantum computing in simple terms",
    "Generate a creative story about a robot learning to paint",
    "Help me debug this JavaScript code..."
  ];

  const handleGenerate = async () => {
    if (!userPrompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedText('');
    setSuggestions([]);
    
    // Simulate API call to AI model
    setTimeout(() => {
      setGeneratedText(`This is a simulated response from ${modelName} to your prompt: "${userPrompt}". In a real implementation, this would be replaced with actual API calls to your AI model. The response would be generated based on the prompt you provided and would typically include relevant, contextual information.`);
      
      setSuggestions([
        `Try being more specific about what you want. For example: "${userPrompt} Provide 3 different versions with varying tones."`,
        `Consider adding constraints like: "${userPrompt} Keep the response under 100 words."`,
        `For better results, you might add context: "I'm a beginner in this subject. ${userPrompt}"`
      ]);
      
      setIsGenerating(false);
    }, 1500);
  };

  const handleUseSuggestion = (suggestion) => {
    setUserPrompt(suggestion);
    setActiveTab('input');
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Prompt Engineering with {modelName}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="font-semibold mb-2 flex items-center">
              <BsLightbulb className="mr-2 text-yellow-500" />
              Your Prompt
            </h2>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here... (Be specific about what you want)"
              className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-3">
              <button
                onClick={handleGenerate}
                disabled={!userPrompt.trim() || isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
                <FiSend className="ml-2" />
              </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="font-semibold mb-2">Example Prompts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setUserPrompt(prompt)}
                  className="text-left p-2 border rounded-lg hover:bg-gray-50 text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 'output' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('output')}
              >
                Output
              </button>
              <button
                className={`flex-1 py-2 px-4 text-center font-medium ${activeTab === 'suggestions' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('suggestions')}
              >
                Suggestions
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'output' ? (
                <div>
                  {isGenerating ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : generatedText ? (
                    <div>
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="whitespace-pre-line">{generatedText}</p>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <button 
                            className="text-gray-500 hover:text-green-600 flex items-center"
                            title="Like"
                          >
                            <FiThumbsUp />
                          </button>
                          <button 
                            className="text-gray-500 hover:text-red-600 flex items-center"
                            title="Dislike"
                          >
                            <FiThumbsDown />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleCopyToClipboard(generatedText)}
                          className="text-gray-500 hover:text-blue-600 flex items-center"
                          title="Copy to clipboard"
                        >
                          <FiCopy className="mr-1" /> Copy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BsLightbulbOff className="mx-auto text-2xl mb-2" />
                      <p>Your generated content will appear here</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Prompt Improvement Suggestions:</h3>
                      {suggestions.map((suggestion, index) => (
                        <div 
                          key={index} 
                          className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => handleUseSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Prompt suggestions will appear here after generation</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptPage;