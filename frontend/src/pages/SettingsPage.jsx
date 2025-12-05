import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient.jsx';
import Navbar from '../components/Navbar.jsx';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    shopDomain: '',
    shopifyAccessToken: '',
  });
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await apiClient.get('/api/tenant/settings');
        setForm({
          name: res.data.name || '',
          shopDomain: res.data.shopDomain || '',
          shopifyAccessToken: res.data.shopifyAccessToken || '',
        });
        setLastSyncedAt(res.data.lastSyncedAt);
      } catch (err) {
        setError('Failed to load settings');
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiClient.put('/api/tenant/settings', form);
      setMessage('Settings saved successfully!');
      setLastSyncedAt(res.data.lastSyncedAt);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings');
    }
    setSaving(false);
  }

  async function handleSync() {
    setSyncing(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiClient.post('/api/sync/run');
      const syncMessage = `Sync completed: ${res.data.customersSynced} customers, ${res.data.ordersSynced} orders, ${res.data.productsSynced} products`;
      setMessage(syncMessage);
      
      // Refresh lastSyncedAt
      const settingsRes = await apiClient.get('/api/tenant/settings');
      setLastSyncedAt(settingsRes.data.lastSyncedAt);
      
      // Navigate to dashboard with refresh flag
      setTimeout(() => {
        navigate('/dashboard', { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to trigger sync');
      setSyncing(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading-state">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="dashboard-container">
        <h2>Settings</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="last-synced-info">
          Last synced at: <strong>{formatDate(lastSyncedAt)}</strong>
        </div>

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label>Tenant Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Shop Domain</label>
            <input
              type="text"
              name="shopDomain"
              value={form.shopDomain}
              onChange={handleChange}
              placeholder="mystore.myshopify.com"
            />
            <small>Your Shopify store domain (e.g., mystore.myshopify.com). Leave empty for demo mode.</small>
          </div>

          <div className="form-group">
            <label>Shopify Access Token</label>
            <input
              type="password"
              name="shopifyAccessToken"
              value={form.shopifyAccessToken}
              onChange={handleChange}
              placeholder="Enter your Shopify Admin API access token"
            />
            <small>Get this from your Shopify Admin API settings. Leave empty for demo mode.</small>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button 
              type="button" 
              onClick={handleSync} 
              disabled={syncing}
              className="secondary-button"
            >
              {syncing ? 'Syncing...' : 'Trigger Sync Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
