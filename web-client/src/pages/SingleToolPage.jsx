import React, { useState } from 'react';
import { 
  FaStar, 
  FaRegStar, 
  FaThumbsUp, 
  FaThumbsDown, 
  FaLink, 
  FaCalendarAlt,
  FaDollarSign,
  FaCheck
} from 'react-icons/fa';
import { HiOutlineChatBubbleLeft } from 'react-icons/hi2';

const toolsInfo = {
  "model_name": "gpt-3.5-turbo",
  "model_category": "chat-gpt",
  "model_type": "text-to-text",
  "organization": "OpenAI",
  "organization_url": "https://openai.com",
  "organization_logo": "https://openai.com/logo.png",
  "model_logo": "https://openai.com/model-logo.png",
  "model_description": "A highly advanced language model that can generate human-like text responses to a wide range of questions and prompts.",
  "model_status": "active",
  "model_created_at": "2022-01-01T00:00:00.000Z",
  "model_updated_at": "2022-01-01T00:00:00.000Z",
  "model_features": [
    "text generation",
    "conversation",
    "coding"
  ],
  "ratting": {
    "average_rating": 4.5,
    "rating_count": 67,
    "upvote": 12,
    "downvote": 23
  },
  "pricing": {
    "model": "usage-based",
    "free_tier": true,
    "starting_price": 0.03,
    "currency": "USD",
    "billing_unit": "per 1K tokens",
    "plans": [
      {
        "name": "Pay-per-use",
        "price": 0.03,
        "unit": "per 1K tokens",
        "features": ["API access", "Rate limiting", "Priority support"]
      }
    ]
  },
  "comments": [
    {
      "comment_id": 1,
      "comment_text": "This model is really helpful for generating text.",
      "comment_author": "John Doe",
      "commment_author_profile": "https://example.com/profile/johndoe",
      "comment_author_profile_pic": "https://example.com/profile/johndoe.jpg",
      "comment_date": "2022-01-01T00:00:00.000Z",
      "comment_upvote": 2,
      "comment_downvote": 1
    },
    {
      "comment_id": 2,
      "comment_text": "I'm not sure about this model, it's not very accurate.",
      "comment_author": "Jane Doe 2",
      "comment_date": "2022-01-01T00:00:00.000Z",
      "comment_upvote": 1,
      "comment_downvote": 3
    }
  ]
};

const SingleToolPage = () => {
  const [comments, setComments] = useState(toolsInfo.comments);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [modelRating, setModelRating] = useState(toolsInfo.ratting);

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
      }
    }
    
    return stars;
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // In a real app, you would send this to your backend
    const newAverage = ((modelRating.average_rating * modelRating.rating_count) + rating) / (modelRating.rating_count + 1);
    setModelRating({
      ...modelRating,
      average_rating: newAverage,
      rating_count: modelRating.rating_count + 1
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      comment_id: comments.length + 1,
      comment_text: newComment,
      comment_author: "You",
      comment_date: new Date().toISOString(),
      comment_upvote: 0,
      comment_downvote: 0
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleModelVote = (type) => {
    if (type === 'upvote') {
      setModelRating({...modelRating, upvote: modelRating.upvote + 1});
    } else {
      setModelRating({...modelRating, downvote: modelRating.downvote + 1});
    }
  };

  const handleCommentVote = (commentId, type) => {
    setComments(comments.map(comment => {
      if (comment.comment_id === commentId) {
        return {
          ...comment,
          comment_upvote: type === 'upvote' ? comment.comment_upvote + 1 : comment.comment_upvote,
          comment_downvote: type === 'downvote' ? comment.comment_downvote + 1 : comment.comment_downvote
        };
      }
      return comment;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex items-start gap-6 mb-8">
        <div className="flex-shrink-0">
          <img 
            src={toolsInfo.model_logo || toolsInfo.organization_logo} 
            alt={`${toolsInfo.model_name} logo`}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{toolsInfo.model_name}</h1>
          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              {renderRatingStars(modelRating.average_rating)}
              <span className="ml-1">{modelRating.average_rating.toFixed(1)}</span>
              <span>({modelRating.rating_count})</span>
            </span>
            <span>•</span>
            <a href={toolsInfo.organization_url} className="flex items-center gap-1 text-blue-600 hover:underline">
              <FaLink className="text-sm" />
              {toolsInfo.organization}
            </a>
          </div>
          <p className="text-gray-700 mb-4">{toolsInfo.model_description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            <span className="flex items-center gap-1">
              <FaCalendarAlt />
              {formatDate(toolsInfo.model_created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Features</h2>
        <div className="flex flex-wrap gap-2">
          {toolsInfo.model_features.map((feature) => (
            <span key={feature} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>
      </div>

      

      {/* Pricing Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Pricing</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {toolsInfo.pricing.plans.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-2xl font-bold">
                  {toolsInfo.pricing.currency}{plan.price}
                </span>
                <span className="text-gray-500 ml-1">{plan.unit}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FaCheck className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              {toolsInfo.pricing.free_tier && index === 0 && (
                <div className="mt-4 text-sm text-green-600">
                  Free tier available
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Rate this model</h2>
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingClick(star)}
              className="text-2xl focus:outline-none"
            >
              {star <= (hoverRating || userRating) ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-yellow-400" />
              )}
            </button>
          ))}
          <span className="ml-2 text-gray-600">
            {userRating > 0 ? `You rated ${userRating} star${userRating > 1 ? 's' : ''}` : 'Rate this model'}
          </span>
        </div>
      </div>

      

      {/* Voting Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Community Feedback</h2>
        <div className="flex gap-6">
          <button 
            onClick={() => handleModelVote('upvote')}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50"
          >
            <FaThumbsUp className="text-green-600" />
            <span>{modelRating.upvote} Upvotes</span>
          </button>
          <button 
            onClick={() => handleModelVote('downvote')}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50"
          >
            <FaThumbsDown className="text-red-600" />
            <span>{modelRating.downvote} Downvotes</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <HiOutlineChatBubbleLeft />
          Comments ({comments.length})
        </h2>
        
        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Comment
          </button>
        </form>
        
        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src={comment.comment_author_profile_pic || "https://via.placeholder.com/40"} 
                  alt={comment.comment_author}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{comment.comment_author}</h3>
                  <p className="text-sm text-gray-500">{formatDate(comment.comment_date)}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{comment.comment_text}</p>
              <div className="flex gap-4 text-sm">
                <button 
                  onClick={() => handleCommentVote(comment.comment_id, 'upvote')}
                  className="flex items-center gap-1 text-gray-500 hover:text-green-600"
                >
                  <FaThumbsUp />
                  {comment.comment_upvote}
                </button>
                <button 
                  onClick={() => handleCommentVote(comment.comment_id, 'downvote')}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-600"
                >
                  <FaThumbsDown />
                  {comment.comment_downvote}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleToolPage;