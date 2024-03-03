import React, { useState, useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import Alerts from './Alerts';
import API_ENDPOINTS from './apiConfig';
import FilterSection from './FilterSection';
import BondsTable from './BondsTable';
import './BondFilterUpdated.css';
import {
  MONTHS_IN_YEAR,
  DUMMY_USER_ID,
  SET_SELECTED_BONDS_STRING,
  ADD_FILTER_STRING,
  SET_ALL_BONDS,
  SET_MAX_MONTHS_RANGE,
  REMOVE_FILTER_STRING,
  UPDATE_FILTER,
  BOND_KEY,
  BONDS_KEY,
  ISIN_KEY,
  CREDIT_SCORE_KEY,
  MATURITY_DATE_KEY,
  THRESHOLD_KEY,
} from './Constants';

export const initialState = {
  allBonds: [],
  filters: [],
  maxMonthsRange: MONTHS_IN_YEAR,
  selectedBonds: new Map()
};

const BondFilterUpdated = () => {
  const [showAlert , setShowAlert] = useState(false);
  const MONTHS_INCREMENT_FACTOR = 1;
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_ALL_BONDS:
        return { ...state, allBonds: action.payload };
      case SET_MAX_MONTHS_RANGE:
        return { ...state, maxMonthsRange: action.payload };
      case ADD_FILTER_STRING:
        return { ...state, filters: [...state.filters, action.payload] };
      case REMOVE_FILTER_STRING:
        return { ...state, filters: state.filters.filter((_, i) => i !== action.payload) };
      case UPDATE_FILTER:
        const updatedFilters = [...state.filters];
        updatedFilters[action.index][action.field] = action.value;
        return { ...state, filters: updatedFilters };
      case SET_SELECTED_BONDS_STRING:
        return { ...state, selectedBonds: action.payload };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const { allBonds, filters, maxMonthsRange, selectedBonds } = state;
  const uniqueCreditScores = useMemo(() => [...new Set(allBonds.map(bond => bond.creditScore))], [allBonds]);
  const uniqueMonths = useMemo(() => Array.from({ length: maxMonthsRange }, (_, i) => i + MONTHS_INCREMENT_FACTOR), [maxMonthsRange]);

  useEffect(() => {
    const fetchAllBonds = async () => {
      try {
        const bondsResponse = await axios.get(API_ENDPOINTS.getBonds());
        const filteredBonds = bondsResponse.data.filter(bond => bond.isin !== '' && bond.maturityDate !== '' && bond.creditScore !== '');
        const maxMaturity = Math.max(...filteredBonds.map(bond => monthsToDisplay(bond.maturityDate)));
        dispatch({ type: SET_ALL_BONDS, payload: filteredBonds });
        dispatch({ type: SET_MAX_MONTHS_RANGE, payload: maxMaturity });
      } catch (error) {
        console.error('Error fetching all bonds data:', error);
      }
    };
    fetchAllBonds();
  }, []);

  useEffect(() => {
    const fetchYourBonds = async () => {
      try {
        const userSelectedBondsResponse = await axios.get(API_ENDPOINTS.getAlertsByUserId(DUMMY_USER_ID));
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
              [BOND_KEY]: {
                [ISIN_KEY]: bond.isin,
                [CREDIT_SCORE_KEY]: bond.creditScore,
                [MATURITY_DATE_KEY]: bond.maturityDate
              },
              [THRESHOLD_KEY]: bond.xirr
            }
          }
        );
        const selectedBondsMap = new Map();
        selectedBonds.forEach(bond => {
            selectedBondsMap.set(bond.bond.isin, bond);
        });
        dispatch({ type: SET_SELECTED_BONDS_STRING, payload: selectedBondsMap});
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
    const months = (maturity.getFullYear() - today.getFullYear()) * MONTHS_IN_YEAR + maturity.getMonth() - today.getMonth();
    return months;
  };

  const handleAddFilter = () => {
    dispatch({ type: ADD_FILTER_STRING, payload: { creditScore: '', maturity: '', threshold: '', bonds: [] } });
  };

  const handleRemoveFilter = (index) => {
    const updatedSelectedBonds = new Map(selectedBonds);
    filters[index].bonds.forEach(bond => updatedSelectedBonds.delete(bond.isin));
    dispatch({ type: SET_SELECTED_BONDS_STRING, payload: updatedSelectedBonds });
    dispatch({ type: REMOVE_FILTER_STRING, payload: index });
  };

  const handleFilterChange = (index, field, value) => {
    dispatch({ type: UPDATE_FILTER, index, field, value });
  };

  const applyFilters = (index) => {
    const filtered = filterBonds(filters[index]);
    dispatch({ type: UPDATE_FILTER, index, field: BONDS_KEY, value: filtered });
  };

  const handleThresholdChange = (bond, threshold) => {
    if (threshold === '' && selectedBonds.has(bond.isin)) {
      dispatch({
        type: SET_SELECTED_BONDS_STRING,
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: '' })
      });
    } else {
      dispatch({
        type: SET_SELECTED_BONDS_STRING,
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: parseInt(threshold) })
      });
    }
  };

  const handleCheckboxChange = (bond) => {
    if (selectedBonds.has(bond.isin)) {
      const updatedSelectedBonds = new Map(selectedBonds);
      updatedSelectedBonds.delete(bond.isin);
      dispatch({ type: SET_SELECTED_BONDS_STRING, payload: updatedSelectedBonds });
    } else {
      dispatch({
        type: SET_SELECTED_BONDS_STRING,
        payload: new Map(selectedBonds).set(bond.isin, { bond, threshold: '' })
      });
    }
  };

  const setAllChecbox = (bonds, isChecked) => {
    const updatedSelectedBonds = new Map(selectedBonds);
    bonds.forEach((bond) => {
      const isSelected = selectedBonds.has(bond.isin);
      if ((isChecked && !isSelected) || (!isChecked && isSelected)) {
        isChecked
          ? updatedSelectedBonds.set(bond.isin, { bond, threshold: '' })
          : updatedSelectedBonds.delete(bond.isin);
      }
    });
    dispatch({ type: SET_SELECTED_BONDS_STRING, payload: updatedSelectedBonds });
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
      userId: DUMMY_USER_ID,
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
      <div style={{ textAlign: 'center' }}>
      <button
        className="show-alert-btn"
        onClick={() => setShowAlert(!showAlert)}
        style={{ marginRight: '10px' }}
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
            setAllChecbox={setAllChecbox}
          />
        </>
      )}
      <button className="add-filter-btn" onClick={handleAddFilter} style={{ marginRight: '10px' }}>
        Add Filter
      </button>
      </div>
      {filters.map((filter, index) => (
        <div key={index}>
          <FilterSection
            filter={filter}
            uniqueCreditScores={uniqueCreditScores}
            uniqueMonths={uniqueMonths}
            handleFilterChange={(field, value) => handleFilterChange(index, field, value)}
            applyFilters={() => applyFilters(index)}
            handleRemoveFilter={() => handleRemoveFilter(index)}
          />
          <h3 className="filtered-bonds-title">Filtered Bonds:</h3>
          <BondsTable
            filter={filter}
            selectedBonds={selectedBonds}
            handleCheckboxChange={handleCheckboxChange}
            handleThresholdChange={handleThresholdChange}
            setAllChecbox={setAllChecbox}
          />
        </div>
      ))}
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};
  
export default BondFilterUpdated;
  