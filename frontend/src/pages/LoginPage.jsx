import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    login(email, password);
  }

  return (
    <div className="centered-bg">
      <div className="auth-card">
        <h2>Sign in to Shopify Insights</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            autoFocus
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <div className="form-error">{error}</div>}
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
