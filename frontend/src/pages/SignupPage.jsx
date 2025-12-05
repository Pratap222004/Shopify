import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const { signup, error } = useAuth();
  const [form, setForm] = useState({
    name: '',
    shopDomain: '',
    shopifyAccessToken: '',
    email: '',
    password: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    signup(form);
  }

  return (
    <div className="centered-bg">
      <div className="auth-card">
        <h2>Create your Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="name"
            type="text"
            placeholder="Tenant/Company Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0e7ef' }}>
            <p style={{ fontSize: '0.85em', color: '#666', marginBottom: '0.8rem' }}>
              <strong>Shopify Connection (Optional):</strong> Add these later in settings to sync your store data.
            </p>
            <input
              name="shopDomain"
              type="text"
              placeholder="Shop Domain (e.g., mystore.myshopify.com)"
              value={form.shopDomain}
              onChange={handleChange}
            />
            <input
              name="shopifyAccessToken"
              type="text"
              placeholder="Shopify Access Token (optional)"
              value={form.shopifyAccessToken}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit">Sign Up</button>
          {error && <div className="form-error">{error}</div>}
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
