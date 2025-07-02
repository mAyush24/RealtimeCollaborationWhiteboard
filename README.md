# React Collaborative Whiteboard

A real-time collaborative whiteboard application built with **React**, **JavaScript**, **Node.js**, **Socket.IO**, and **MongoDB**. No TypeScript or Next.js - pure React with Vite!

## 🎨 Features

### ✨ **Real-time Collaboration**
- Multiple users can draw simultaneously on the same whiteboard
- Instant synchronization of all drawing actions
- Live user presence indicators
- Real-time cursor tracking (framework ready)

### 🔐 **Authentication System**
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and API endpoints

### 🎯 **Drawing Tools**
- **Pen Tool**: Customizable colors and brush sizes (1-20px)
- **Eraser Tool**: Clean removal of drawings
- **Undo Function**: Remove last drawing action
- **Clear Board**: Reset entire whiteboard
- **Color Picker**: Full spectrum color selection

### 💾 **Board Management**
- **Auto-save**: Boards automatically saved to MongoDB
- **Manual Save**: Save button for explicit saves
- **Board Persistence**: Reload saved boards when rejoining
- **Export PNG**: Download whiteboard as high-quality PNG
- **Unique Board IDs**: Easy sharing with generated IDs

### 💬 **Real-time Chat**
- In-board messaging system
- System notifications (user join/leave)
- Message history during session
- User identification in chat

### 📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Adaptive UI for different screen sizes
- Touch-friendly controls for mobile devices

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Fabric.js** - Advanced canvas manipulation
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **Pure CSS** - Custom styling (no frameworks)

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### 1. Clone Repository
\`\`\`bash
git clone <your-repo-url>
cd react-collaborative-whiteboard
\`\`\`

### 2. Install Dependencies
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

### 3. Environment Setup
Create a \`.env\` file in the \`server\` directory:

\`\`\`env
MONGODB_URI=mongodb+srv://ayushmishra252004:ayush24m@cluster0.jertr8u.mongodb.net/
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
\`\`\`

### 4. Start Development Servers
From the root directory:
\`\`\`bash
npm run dev
\`\`\`

This starts both:
- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## 📖 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your dashboard with your credentials
3. **Create Board**: Generate a new whiteboard with unique ID
4. **Share ID**: Copy and share the board ID with collaborators
5. **Join Board**: Enter a board ID to join existing sessions

### Drawing Tools
- **Select Pen**: Click the pen tool and choose your color
- **Adjust Brush**: Use the slider to change brush width (1-20px)
- **Switch to Eraser**: Click eraser tool to remove drawings
- **Undo**: Remove the last drawing action
- **Clear All**: Reset the entire whiteboard

### Collaboration
- **Real-time Drawing**: See others draw as they create
- **User List**: View all connected users in the sidebar
- **Chat**: Communicate with team members
- **Auto-sync**: All changes sync automatically

### Saving & Exporting
- **Auto-save**: Boards save automatically to database
- **Manual Save**: Click save button for explicit saves
- **Export PNG**: Download your whiteboard as an image
- **Reload**: Rejoin boards to load saved content

## 🏗 Project Structure

\`\`\`
react-collaborative-whiteboard/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/           # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Whiteboard.jsx
│   │   ├── styles/             # CSS stylesheets
│   │   │   └── index.css
│   │   ├── App.jsx             # Main App component
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js backend
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   └── Board.js
│   ├── routes/                 # Express routes
│   │   ├── auth.js
│   │   └── boards.js
│   ├── socket/                 # Socket.IO handlers
│   │   └── socketHandlers.js
│   ├── middleware/             # Express middleware
│   │   └── auth.js
│   ├── index.js                # Server entry point
│   ├── .env                    # Environment variables
│   └── package.json
├── package.json                # Root package.json
└── README.md
\`\`\`

## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/signup\` - User registration
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/verify\` - Token verification

### Boards
- \`GET /api/boards/:boardId\` - Get board data
- \`POST /api/boards/:boardId/save\` - Save board data
- \`GET /api/boards/user/boards\` - Get user's boards

### Health Check
- \`GET /api/health\` - Server status

## 🔄 Socket Events

### Client → Server
- \`join-board\` - Join a whiteboard room
- \`drawing\` - Send drawing data to other users
- \`chat-message\` - Send chat message
- \`save-board\` - Save board to database
- \`cursor-move\` - Send cursor position (optional)

### Server → Client
- \`user-joined\` - User joined the board
- \`user-left\` - User left the board
- \`users-update\` - Updated list of connected users
- \`drawing-data\` - Receive drawing data from other users
- \`chat-message\` - Receive chat message
- \`board-data\` - Load existing board data
- \`board-saved\` - Board save confirmation
- \`cursor-update\` - Receive cursor position (optional)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation
- **CORS Configuration**: Controlled cross-origin access
- **Socket Authentication**: Verified socket connections
- **Protected Routes**: Auth-required endpoints
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: \`cd client && npm run build\`
2. Deploy the \`dist\` folder
3. Update API URLs for production

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables on hosting platform
2. Deploy the server directory
3. Ensure MongoDB connection for production

### Environment Variables for Production
\`\`\`env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
PORT=5000
NODE_ENV=production
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: \`git checkout -b feature-name\`
3. Commit changes: \`git commit -am 'Add feature'\`
4. Push to branch: \`git push origin feature-name\`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Check existing documentation
- Review the code comments for implementation details

## 🎯 Future Enhancements

- [ ] Shape tools (rectangle, circle, line)
- [ ] Layer management
- [ ] Board templates
- [ ] User cursor tracking
- [ ] Voice chat integration
- [ ] Mobile app version
- [ ] Advanced drawing tools
- [ ] Board sharing permissions
- [ ] Export to different formats
- [ ] Collaborative text editing

---

**Built with ❤️ using React and JavaScript**
\`\`\`

Perfect! I've created a complete **React + JavaScript collaborative whiteboard application** without any TypeScript or Next.js. Here's what you get:

## 🎯 **Key Features Delivered:**

### **✅ Pure React + JavaScript**
- React 18 with Vite (no TypeScript)
- Modern JavaScript with ES6+ features
- Clean, readable code structure

### **✅ Real-time Collaboration**
- Socket.IO for instant synchronization
- Multi-user drawing sessions
- Live user presence indicators
- Real-time chat system

### **✅ Complete Authentication**
- JWT-based login/signup system
- Password hashing with bcrypt
- Protected routes and middleware
- MongoDB user storage

### **✅ Advanced Drawing Tools**
- Fabric.js canvas with pen/eraser tools
- Customizable colors and brush sizes
- Undo functionality and clear board
- PNG export capability

### **✅ Board Management**
- Unique board IDs for easy sharing
- Auto-save to MongoDB
- Board persistence across sessions
- Dashboard for creating/joining boards

### **✅ Professional UI**
- Beautiful, responsive design with pure CSS
- Mobile-friendly interface
- Intuitive user experience
- Clean, modern styling

## 🚀 **Quick Start:**

1. **Install dependencies** in both client and server folders
2. **Set up MongoDB** with the provided connection string
3. **Configure environment variables** in server/.env
4. **Run `npm run dev`** from the root directory

The app will start with the client on `http://localhost:3000` and server on `http://localhost:5000`.
