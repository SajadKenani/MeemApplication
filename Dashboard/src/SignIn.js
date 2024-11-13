
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SignIn = ({ onSignIn }) => { // Accept onSignIn as a prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUsername = process.env.REACT_APP_USERNAME;
    const storedPassword = process.env.REACT_APP_PASSWORD;

    if (username === storedUsername && password === storedPassword) {
      onSignIn(); // Call onSignIn to update authentication state
      navigate('/add'); // Redirect to the add page upon successful login
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="sign-in-container">
      <h2 className="sign-in-title">!مرحبا بعودتك</h2>
      <form onSubmit={handleSubmit} className="sign-in-form">
        <div className="form-group">
          <label htmlFor="username">:الاسم الكامل</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">:كلمة المرور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="form-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-btn">تسجيل الدخول</button>
      </form>
    
    </div>
  );
};

export default SignIn;
