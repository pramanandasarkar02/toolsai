export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const MODEL_CATEGORIES = [
  'LANGUAGE_MODEL',
  'COMPUTER_VISION',
  'AUDIO_PROCESSING',
  'TEXT_TO_SPEECH',
  'SPEECH_TO_TEXT',
  'IMAGE_GENERATION',
  'VIDEO_PROCESSING',
  'NATURAL_LANGUAGE_PROCESSING'
];

export const PRICING_TYPES = [
  'FREE',
  'FREEMIUM',
  'PAID',
  'SUBSCRIPTION',
  'PAY_PER_USE'
];

export const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Newest First' },
  { value: 'viewCount,desc', label: 'Most Viewed' },
  { value: 'likeCount,desc', label: 'Most Liked' },
  { value: 'averageRating,desc', label: 'Highest Rated' },
  { value: 'modelName,asc', label: 'Name A-Z' }
];
