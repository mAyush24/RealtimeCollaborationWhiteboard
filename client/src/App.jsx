import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Header from "./components/Header"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Whiteboard from "./pages/Whiteboard"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/board/:boardId"
              element={
                <ProtectedRoute>
                  <Whiteboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
