import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient.jsx';
import { setToken, clearToken, getToken } from '../utils/auth.jsx';

export default function useAuth() {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Decode user from token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.id, tenantId: payload.tenantId });
      } catch (e) {
        // Invalid token, clear it
        clearToken();
      }
    }
  }, []);

  async function login(email, password) {
    setError(null);
    try {
      const res = await apiClient.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(res.data.token.split('.')[1]));
        setUser({ id: payload.id, tenantId: payload.tenantId, email });
      } catch (e) {}
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  async function signup(payload) {
    setError(null);
    try {
      const res = await apiClient.post('/api/auth/signup', payload);
      setToken(res.data.token);
      // Decode token to get user info
      try {
        const tokenPayload = JSON.parse(atob(res.data.token.split('.')[1]));
        setUser({ id: tokenPayload.id, tenantId: tokenPayload.tenantId, email: payload.email });
      } catch (e) {}
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Signup failed';
      setError(errorMsg);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    navigate('/login');
  }

  return {
    token: getToken(),
    user,
    error,
    login,
    signup,
    logout,
  };
}
