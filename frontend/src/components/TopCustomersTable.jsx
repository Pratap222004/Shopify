import React from 'react';

export default function TopCustomersTable({ customers }) {
  if (!customers || customers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        No customer data available yet
      </div>
    );
  }

  return (
    <table className="basic-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Total Spent</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, index) => (
          <tr key={c.email || index}>
            <td>{c.name}</td>
            <td>{c.email}</td>
            <td>${c.totalSpend.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
