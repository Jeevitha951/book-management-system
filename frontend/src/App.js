import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="app-header">
          <h1>📘 Book Management App</h1>
          <LogoutButton />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <BookForm />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    navigate('/login');
  };

  return localStorage.getItem('token') ? (
    <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
  ) : null;
};

export default App;
