import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { ADD } from './addProduct';
import { SHOW } from './showProducts';
import { ADDDEPT } from './addDepartment';
import SignIn from './SignIn';
import { ORDERS } from './orders';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useNavigate should be called inside the Router context
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      navigate('/show'); // Navigate to /add when authenticated
    }
  }, []); // Include navigate as a dependency

  const handleSignIn = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/add'); // Redirect to /add on sign-in
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/'); // Redirect to home on logout
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {setIsMenuOpen(false);};

  const handleLogin = async (username, password) => {
    try {const response = await fetch("api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }), // try postform
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
          
        } else { const errorData = await response.json();   }
    } catch (error) { console.log("Error during login: " + error.message); }};
useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = process.env.REACT_APP_TOKEN_NAME;
    const storedPassword = process.env.REACT_APP_TOKEN_PASSWORD;
    if (!token) { handleLogin(storedUsername, storedPassword); // Replace with real credentials for testing
    } 
}, []);

  return (
    <div className="App">
      {/* Desktop Navigation */}
      <nav className="nav-bar desktop-nav">
        <ul className="nav-links">
          {isAuthenticated ? (
            <div style={{ display: "grid", textAlign: "end", width: "90%", marginTop: "100px" }}>
             
              <li style={{ textAlign: "end" }}>
                <NavLink to="/add" className="nav-link" onClick={handleLinkClick}>
                  اضافة عرض
                </NavLink>
              </li>
              <li>
                <NavLink to="/show" className="nav-link" onClick={handleLinkClick}>
                  العروض
                </NavLink>
              </li>
              <li>
                <NavLink to="/dept" className="nav-link" onClick={handleLinkClick}>
                  الاقسام
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="nav-link" onClick={handleLinkClick}>
                  الطلبات
                </NavLink>
              </li>
              <li>
                <button className="logout-btn" onClick={() => { handleLogout(); handleLinkClick(); }}>
                  تسجيل الخروج
                </button>
              </li>
            </div>
          ) : (
            <li>
              <NavLink to="/" className="nav-link" onClick={handleLinkClick}>
                تسجيل الدخول
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="hamburger" onClick={toggleMenu}>
        ☰ {/* Hamburger Icon */}
      </div>

      {/* Mobile Navigation */}
      <div className="content">
        <Routes>
          <Route path="/" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/add" element={isAuthenticated ? <ADD /> : <Navigate to="/" />} />
          <Route path="/show" element={isAuthenticated ? <SHOW /> : <Navigate to="/" />} />
          <Route path="/dept" element={isAuthenticated ? <ADDDEPT /> : <Navigate to="/" />} />
          <Route path="/orders" element={isAuthenticated ? <ORDERS /> : <Navigate to="/" />} />
        </Routes>
      </div>

      <nav className={`nav-bar mobile-nav nav-links ${isMenuOpen ? 'show' : ''}`}>
        <ul>
          {isAuthenticated ? (
            <div>
              <li>
                <NavLink to="/add" className="nav-link" onClick={handleLinkClick}>
                  اضافة عرض
                </NavLink>
              </li>
              <li>
                <NavLink to="/show" className="nav-link" onClick={handleLinkClick}>
                  العروض
                </NavLink>
              </li>
              <li>
                <NavLink to="/dept" className="nav-link" onClick={handleLinkClick}>
                  الاقسام
                </NavLink>
              </li>
              <li>
                <NavLink to="/orders" className="nav-link" onClick={handleLinkClick}>
                  العروض
                </NavLink>
              </li>
              <li>
                <button className="logout-btn" onClick={() => { handleLogout(); handleLinkClick(); }}>
                  تسجيل الخروج
                </button>
              </li>
              <li>
                <button className="signup-btn" onClick={toggleMenu}>
                  رجوع
                </button>
              </li>
            </div>
          ) : (
            <li>
              <NavLink to="/" className="nav-link" onClick={handleLinkClick}>
                تسجيل الدخول
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
