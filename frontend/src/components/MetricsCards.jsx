import React from 'react';

const icons = {
  'Total Customers': '👥',
  'Total Orders': '📦',
  'Total Revenue': '💰',
  'Avg Order Value': '💵',
  'Repeat Customer Rate': '🔄',
};

export default function MetricsCards({ 
  totalCustomers, 
  totalOrders, 
  totalRevenue, 
  averageOrderValue,
  repeatCustomerRate 
}) {
  const items = [
    { label: 'Total Customers', value: totalCustomers || 0, icon: icons['Total Customers'] },
    { label: 'Total Orders', value: totalOrders || 0, icon: icons['Total Orders'] },
    { label: 'Total Revenue', value: `$${(totalRevenue || 0).toFixed(2)}`, icon: icons['Total Revenue'] },
    { label: 'Avg Order Value', value: `$${(averageOrderValue || 0).toFixed(2)}`, icon: icons['Avg Order Value'] },
    { label: 'Repeat Customer Rate', value: `${(repeatCustomerRate || 0).toFixed(1)}%`, icon: icons['Repeat Customer Rate'] },
  ];
  
  return (
    <div className="metrics-cards">
      {items.map((item) => (
        <div className="metric-card" key={item.label}>
          <div className="metric-icon">{item.icon}</div>
          <div className="metric-label">{item.label}</div>
          <div className="metric-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
