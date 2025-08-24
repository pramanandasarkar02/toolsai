# ToolsAI Frontend

A React-based frontend for the ToolsAI platform - an AI model discovery and integration platform.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── context/       # React Context for state management
├── services/      # API service layer
├── hooks/         # Custom React hooks
├── utils/         # Utility functions and constants
└── styles/        # CSS files and styling
```

## Environment Variables

Copy `.env.example` to `.env` and update the values:

- `REACT_APP_API_BASE_URL` - Backend API URL
- `REACT_APP_APP_NAME` - Application name

## Technology Stack

- React 18
- Tailwind CSS
- React Icons
- Context API for state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
