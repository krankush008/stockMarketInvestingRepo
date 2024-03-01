import React, { useEffect, useState} from 'react'
import './Alerts.css';

const Alerts = (props) => {
  const {selectedBonds = [], handleThresholdChange, handleCheckboxChange } = props;
 
  const itemsPerPage = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the range of bonds to display based on pagination
  const indexOfLastBond = currentPage * itemsPerPage;
  const indexOfFirstBond = indexOfLastBond - itemsPerPage;
  const currentBonds = Array.from(selectedBonds.values()).slice(indexOfFirstBond, indexOfLastBond);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <table className="filtered-bonds-table">
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
          {currentBonds.map((bond) => (
            <tr key={bond.bond.isin} className="bond-row">
              <td>
                <label className="bond-checkbox-label">
                  <input
                    type="checkbox"
                    className="bond-checkbox"
                    checked={true}
                    onChange={() => handleCheckboxChange(bond.bond)}
                  />
                </label>
              </td>
              <td>{bond.bond.isin}</td>
              <td>{bond.bond.creditScore}</td>
              <td>{bond.bond.maturityDate}</td>
              <td>
                {selectedBonds.get(bond.bond.isin).threshold === '' && (
                  <span style={{ color: 'red' }}>Please enter threshold</span>
                )}
                <input
                  type="number"
                  className="threshold-input"
                  min="0"
                  value={selectedBonds.get(bond.bond.isin).threshold}
                  onChange={(e) => handleThresholdChange(bond.bond, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(selectedBonds.size / itemsPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Alerts