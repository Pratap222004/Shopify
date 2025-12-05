import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../api/apiClient.jsx';
import Navbar from '../components/Navbar.jsx';
import MetricsCards from '../components/MetricsCards.jsx';
import OrdersByDateChart from '../components/OrdersByDateChart.jsx';
import RevenueByDateChart from '../components/RevenueByDateChart.jsx';
import TopCustomersTable from '../components/TopCustomersTable.jsx';
import DateRangePicker from '../components/DateRangePicker.jsx';

function dateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export default function DashboardPage() {
  const location = useLocation();
  const [dateRange, setDateRange] = useState({
    from: dateNDaysAgo(30),
    to: new Date().toISOString().split('T')[0],
  });
  const [summary, setSummary] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all metrics
  const fetchAllMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, orders, revenue, top, settings] = await Promise.all([
        apiClient.get('/api/metrics/summary'),
        apiClient.get('/api/metrics/orders-by-date', { params: dateRange }),
        apiClient.get('/api/metrics/revenue-by-date', { params: dateRange }),
        apiClient.get('/api/metrics/top-customers'),
        apiClient.get('/api/tenant/settings').catch(() => ({ data: { lastSyncedAt: null } })),
      ]);
      setSummary(sum.data);
      setOrdersByDate(orders.data);
      setRevenueByDate(revenue.data);
      setTopCustomers(top.data);
      setLastSyncedAt(settings.data?.lastSyncedAt);
    } catch (err) {
      setError('Failed to load metrics');
      console.error('Dashboard error:', err);
    }
    setLoading(false);
  }, [dateRange]);

  useEffect(() => {
    fetchAllMetrics();
  }, [fetchAllMetrics]);

  // Refresh when navigating from settings (after sync)
  useEffect(() => {
    if (location.state?.refresh) {
      fetchAllMetrics();
      // Clear the refresh flag
      window.history.replaceState({}, document.title);
    }
  }, [location.state, fetchAllMetrics]);

  function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="dashboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Dashboard</h2>
          {lastSyncedAt && (
            <div className="last-synced-info" style={{ fontSize: '0.85em' }}>
              Last synced: {formatDate(lastSyncedAt)}
            </div>
          )}
        </div>
        {loading ? (
          <div className="loading-state">Loading metrics...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <>
            <MetricsCards {...summary} />
            <DateRangePicker
              from={dateRange.from}
              to={dateRange.to}
              onChange={setDateRange}
            />
            <div className="dashboard-charts">
              <div className="dashboard-chart-box">
                <h3>Orders by Date</h3>
                <OrdersByDateChart data={ordersByDate} />
              </div>
              <div className="dashboard-chart-box">
                <h3>Revenue by Date</h3>
                <RevenueByDateChart data={revenueByDate} />
              </div>
            </div>
            <div className="dashboard-charts">
              <div className="dashboard-chart-box full-width">
                <h3>Top Customers</h3>
                <TopCustomersTable customers={topCustomers} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
