# Collaborative Whiteboard

A real-time collaborative whiteboard application built with React, Node.js, Socket.IO, and MongoDB.

## Features

- **Real-time Collaboration**: Multiple users can draw on the same whiteboard simultaneously
- **Authentication**: Secure user registration and login with JWT
- **Drawing Tools**: Pen tool with customizable colors and brush sizes
- **Board Management**: Create new boards or join existing ones with unique IDs
- **Real-time Chat**: Communicate with other users while collaborating
- **Board Persistence**: Save and load board data from MongoDB
- **Export Functionality**: Export whiteboards as PNG images
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React.js with Vite
- Fabric.js for canvas manipulation
- Socket.IO client for real-time communication
- React Router for navigation
- Axios for HTTP requests
- Plain CSS for styling

### Backend
- Node.js with Express
- Socket.IO for real-time features
- MongoDB with Mongoose for data persistence
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd collaborative-whiteboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   \`\`\`

3. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   \`\`\`env
   MONGODB_URI=mongodb+srv://ayushmishra252004:ayush24m@cluster0.jertr8u.mongodb.net/
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   \`\`\`

4. **Start the application**
   
   From the root directory:
   \`\`\`bash
   npm run dev
   \`\`\`
   
   This will start both the client (http://localhost:3000) and server (http://localhost:5000) concurrently.

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Dashboard**: Access your dashboard to create new boards or join existing ones
3. **Create Board**: Click "Create New Board" to start a new whiteboard session
4. **Join Board**: Enter a board ID to join an existing collaborative session
5. **Drawing**: Use the pen tool with different colors and brush sizes
6. **Collaborate**: Share the board ID with others for real-time collaboration
7. **Chat**: Use the chat panel to communicate with other users
8. **Save/Export**: Save your work or export as PNG

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Boards
- `GET /api/boards/:boardId` - Get board data
- `POST /api/boards/:boardId/save` - Save board data

## Socket Events

### Client to Server
- `join-board` - Join a whiteboard room
- `drawing` - Send drawing data
- `chat-message` - Send chat message
- `save-board` - Save board to database
- `cursor-move` - Send cursor position

### Server to Client
- `user-joined` - User joined the board
- `user-left` - User left the board
- `users-update` - Updated list of connected users
- `drawing-data` - Receive drawing data from other users
- `chat-message` - Receive chat message
- `board-data` - Load existing board data
- `cursor-update` - Receive cursor position from other users

## Project Structure

\`\`\`
collaborative-whiteboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.IO handlers
│   ├── middleware/         # Express middleware
│   ├── index.js            # Server entry point
│   └── .env                # Environment variables
├── package.json            # Root package.json
└── README.md
\`\`\`

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration
- Socket.IO authentication middleware
- Protected routes and API endpoints

## Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API URLs in production

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Deploy the server directory
3. Ensure MongoDB connection is configured for production

### Environment Variables for Production
\`\`\`env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
NODE_ENV=production
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on the GitHub repository.
