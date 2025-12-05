import React from 'react';

export default function DateRangePicker({ from, to, onChange }) {
  function handleChange(e) {
    const { name, value } = e.target;
    onChange({
      from: name === 'from' ? value : from,
      to: name === 'to' ? value : to,
    });
  }
  return (
    <div className="date-range-picker">
      <label>
        From:
        <input
          type="date"
          name="from"
          value={from}
          onChange={handleChange}
        />
      </label>
      <label>
        To:
        <input
          type="date"
          name="to"
          value={to}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
