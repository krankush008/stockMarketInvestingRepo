import React, { useState, useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import './BondFilterUpdated.css';
import Alerts from './Alerts';
import API_ENDPOINTS from './apiConfig';

const monthsInYear = 12;
export const initialState = {
  allBonds: [],
  filters: [],
  maxMonthsRange: monthsInYear,
  selectedBonds: new Map(),
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL_BONDS':
      return { ...state, allBonds: action.payload };
    case 'SET_MAX_MONTHS_RANGE':
      return { ...state, maxMonthsRange: action.payload };
    case 'ADD_FILTER':
      return { ...state, filters: [...state.filters, action.payload] };
    case 'REMOVE_FILTER':
      return { ...state, filters: state.filters.filter((_, i) => i !== action.payload) };
    case 'UPDATE_FILTER':
      const updatedFilters = [...state.filters];
      updatedFilters[action.index][action.field] = action.value;
      return { ...state, filters: updatedFilters };
    case 'SET_SELECTED_BONDS':
      return { ...state, selectedBonds: action.payload };
    default:
      return state;
  }
};

const BondFilterUpdated = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { allBonds, filters, maxMonthsRange, selectedBonds } = state;
  const [showAlert , setShowAlert] = useState(false);
  const uniqueCreditScores = useMemo(() => [...new Set(allBonds.map(bond => bond.creditScore))], [allBonds]);
  const uniqueMonths = useMemo(() => Array.from({ length: maxMonthsRange }, (_, i) => i + 1), [maxMonthsRange]);
  const dummyUserId = 124;
  const monthsInYear = 12;

  useEffect(() => {
    const fetchAllBonds = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getBonds());
        // Filter out the empty object from the response data
        const filteredBonds = response.data.filter(bond => bond.isin !== '' && bond.maturityDate !== '' && bond.creditScore !== '');
        dispatch({ type: 'SET_ALL_BONDS', payload: filteredBonds });
        const maxMaturity = Math.max(...filteredBonds.map(bond => monthsToDisplay(bond.maturityDate)));
        dispatch({ type: 'SET_MAX_MONTHS_RANGE', payload: maxMaturity });
      } catch (error) {
        console.error('Error fetching all bonds data:', error);
      }
    };
    
    fetchAllBonds();
  }, []);

  useEffect(() => {
    const fetchYourBonds = async () => {
      try {
        const userSelectedBondsResponse = await axios.get(API_ENDPOINTS.getAlertsByUserId(dummyUserId));
        
        const userSelectedBonds = userSelectedBondsResponse.data.map(bond => ({
            isin: bond.bondId,
            xirr: bond.xirr
        }));
        const yourBonds = allBonds.filter(bond => {
            return userSelectedBonds.some(selectedBond => selectedBond.isin === bond.isin);
        }).map(filteredBond => ({
            ...filteredBond,
            xirr: userSelectedBonds.find(selectedBond => selectedBond.isin === filteredBond.isin).xirr
        }));
 
        const selectedBonds = yourBonds.map(bond => {
            return {
              "bond": {
                  "isin": bond.isin,
                  "creditScore": bond.creditScore,
                  "maturityDate": bond.maturityDate
              },
              "threshold": bond.xirr
            }
          }
        );
        const selectedBondsMap = new Map();
        selectedBonds.forEach(bond => {
            selectedBondsMap.set(bond.bond.isin, bond);
        });
        dispatch({ type: 'SET_SELECTED_BONDS', payload: selectedBondsMap});
      } catch (error) {
        console.error('Error fetching all bonds data:', error);
      }
    };
    fetchYourBonds();
  }, [allBonds]);

  const filterBonds = useMemo(() => (filters) => {
    return allBonds.filter(bond => {
      const creditScoreMatch = !filters.creditScore || bond.creditScore === filters.creditScore;
      const maturityMatch = !filters.maturity || monthsToDisplay(bond.maturityDate) <= filters.maturity;
      return creditScoreMatch && maturityMatch;
    });
  }, [allBonds]);

  const monthsToDisplay = (maturityDate) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const months = (maturity.getFullYear() - today.getFullYear()) * monthsInYear + maturity.getMonth() - today.getMonth();
    return months;
  };

  const handleAddFilter = () => {
    dispatch({ type: 'ADD_FILTER', payload: { creditScore: '', maturity: '', threshold: '', bonds: [] } });
  };

  const handleRemoveFilter = (index) => {
    const updatedSelectedBonds = new Map(selectedBonds);
    filters[index].bonds.forEach(bond => updatedSelectedBonds.delete(bond.isin));
    dispatch({ type: 'SET_SELECTED_BONDS', payload: updatedSelectedBonds });
    dispatch({ type: 'REMOVE_FILTER', payload: index });
  };

  const handleFilterChange = (index, field, value) => {
    dispatch({ type: 'UPDATE_FILTER', index, field, value });
  };

  const applyFilters = (index) => {
    const filtered = filterBonds(filters[index]);
    dispatch({ type: 'UPDATE_FILTER', index, field: 'bonds', value: filtered });
  };

  const handleThresholdChange = (bond, threshold) => {
    if (threshold === '' && selectedBonds.has(bond.isin)) {
      dispatch({
        type: 'SET_SELECTED_BONDS',
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: '' })
      });
    } else {
      dispatch({
        type: 'SET_SELECTED_BONDS',
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: parseInt(threshold) })
      });
    }
  };

  const handleCheckboxChange = (bond) => {
    if (selectedBonds.has(bond.isin)) {
      const updatedSelectedBonds = new Map(selectedBonds);
      updatedSelectedBonds.delete(bond.isin);
      dispatch({ type: 'SET_SELECTED_BONDS', payload: updatedSelectedBonds });
    } else {
      dispatch({
        type: 'SET_SELECTED_BONDS',
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: '' })
      });
    }
  };

  const handleSubmit = () => {
    const selectedBondsArray = Array.from(selectedBonds.values());
    const invalidThreshold = selectedBondsArray.some(bond => bond.threshold === '');
    if (invalidThreshold) {
      alert('Please enter threshold for all selected bonds');
      return;
    }
    const alerts = selectedBondsArray.map(bond => ({
      bondsId: bond.bond.isin,
      userId: dummyUserId,
      xirr: bond.threshold
    }));
    axios.put(API_ENDPOINTS.createAlerts(), alerts)
      .then(response => {
        console.log('Alerts created successfully:', response.data);
      })
      .catch(error => {
        console.error('Error creating alerts:', error.message);
      });
  };

  return (
    <div className="bond-filter-container">
      <h2 className="page-title">Bond Filters</h2>
      <button
        className="show-alert-btn"
        onClick={() => setShowAlert(!showAlert)}
      >
        {showAlert ? 'Hide Alerts' : 'Show saved Alerts'}
      </button>
      {showAlert && (
        <>
          <h2>Saved Alerts</h2>
          <Alerts
            selectedBonds={selectedBonds}
            handleThresholdChange={handleThresholdChange}
            handleCheckboxChange={handleCheckboxChange}
          />
        </>
      )}
      <button className="add-filter-btn" onClick={handleAddFilter}>
        Add Filter
      </button>
      {filters.map((filter, index) => (
        <div key={index} className="filter-section">
          <div className="filter-inputs">
            <label className="filter-label">Credit Score:</label>
            <select
              className="filter-select"
              onChange={(e) =>
                handleFilterChange(index, 'creditScore', e.target.value)
              }
              value={filter.creditScore}
            >
              <option value="">Select Credit Score</option>
              {uniqueCreditScores.map((score, i) => (
                <option key={i} value={score}>
                  {score}
                </option>
              ))}
            </select>
            <label className="filter-label">Maturity:</label>
            <select
              className="filter-select"
              onChange={(e) =>
                handleFilterChange(index, 'maturity', e.target.value)
              }
              value={filter.maturity}
            >
              <option value="">Select Maturity</option>
              {uniqueMonths.map((month, i) => (
                <option key={i} value={month}>
                  {month} months
                </option>
              ))}
            </select>
          </div>
          <div className="filter-buttons">
            <button
              className="apply-filter-btn"
              onClick={() => applyFilters(index)}
            >
              Apply Filters
            </button>
            <button
              className="remove-filter-btn"
              onClick={() => handleRemoveFilter(index)}
            >
              Remove
            </button>
          </div>
          <h3 className="filtered-bonds-title">Filtered Bonds:</h3>
      <table className="bond-table">
      <thead>
        <tr>
          <th>Select</th>
          <th>ID</th>
          <th>Credit Score</th>
          <th>Maturity</th>
          <th>Threshold</th>
        </tr>
      </thead>
      <tbody>
        {filter.bonds.length > 0 ? (
          filter.bonds.map((bond, bondIndex) => (
            <tr key={bondIndex} className="bond-item">
              <td>
                <input
                  type="checkbox"
                  className="bond-checkbox"
                  onChange={() => handleCheckboxChange(bond)}
                  checked={selectedBonds.has(bond.isin)}
                />
              </td>
              <td>{bond.isin}</td>
              <td>{bond.creditScore}</td>
              <td>{bond.maturityDate}</td>
              <td>
                {selectedBonds.has(bond.isin) &&
                selectedBonds.get(bond.isin).threshold === '' && (
                  <span style={{ color: 'red', marginLeft: '10px' }}>
                    Please enter threshold
                  </span>
                )}
                <input
                  type="number"
                  className="threshold-input"
                  min="0"
                  value={
                    selectedBonds.has(bond.isin)
                      ? selectedBonds.get(bond.isin).threshold
                      : ''
                  }
                  onChange={(e) => handleThresholdChange(bond, e.target.value)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No bonds found</td>
          </tr>
        )}
      </tbody>
    </table>

      </div>
      ))}
 
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
  };
  
  export default BondFilterUpdated;
  