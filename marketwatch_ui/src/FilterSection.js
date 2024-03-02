import React from 'react';
import './FilterSection.css';

const FilterSection = ({
  filter,
  uniqueCreditScores,
  uniqueMonths,
  handleFilterChange,
  applyFilters,
  handleRemoveFilter
}) => {
  return (
    <div className="filter-section">
  <div className="filter-inputs">
    <div className="filter-input">
      <label className="filter-label">Credit Score:</label>
      <select
        className="filter-select"
        onChange={(e) => handleFilterChange('creditScore', e.target.value)}
        value={filter.creditScore}
        style={{ width: '200px' }}
      >
        <option value="">Select Credit Score</option>
        {uniqueCreditScores.map((score, i) => (
          <option key={i} value={score}>
            {score}
          </option>
        ))}
      </select>
    </div>
    <div className="filter-input">
      <label className="filter-label">Maturity:</label>
      <select
        className="filter-select"
        onChange={(e) => handleFilterChange('maturity', e.target.value)}
        value={filter.maturity}
        style={{ width: '200px' }}
      >
        <option value="">Select Maturity</option>
        {uniqueMonths.map((month, i) => (
          <option key={i} value={month}>
            {month} months
          </option>
        ))}
      </select>
    </div>
  </div>
  <div className="filter-buttons" style={{ marginBottom: '20px' }}>
    <button className="apply-filter-btn" onClick={applyFilters}>
      Apply Filters
    </button>
    <button className="remove-filter-btn" onClick={handleRemoveFilter}>
      Remove
    </button>
  </div>
</div>

  );
};

export default FilterSection;
