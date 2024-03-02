import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper } from '@mui/material';
import "./BondsTable.css"

const BondsTable = ({ filter, selectedBonds, handleCheckboxChange, handleThresholdChange }) => {
    const itemsPerPage = 5; // Set the number of items per page
    const [currentPage, setCurrentPage] = useState(1);
  
    // Calculate the range of bonds to display based on pagination
    const indexOfLastBond = currentPage * itemsPerPage;
    const indexOfFirstBond = indexOfLastBond - itemsPerPage;
    const currentBonds = Array.from(filter.bonds.values()).slice(indexOfFirstBond, indexOfLastBond);
  
    const paginate = (action) => {
        if (action === 'prev' && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else if (action === 'next' && currentPage < Math.ceil(filter.bonds.length / itemsPerPage)) {
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          setCurrentPage(action); // Handle other cases or actions as needed
        }
      };
      
    
    return (

    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell align="right" className="table-head-cell">Select</TableCell>
            <TableCell align="right" className="table-head-cell">ID</TableCell>
            <TableCell align="right" className="table-head-cell">Credit Score</TableCell>
            <TableCell align="right" className="table-head-cell">Maturity</TableCell>
            <TableCell align="right" className="table-head-cell">Threshold</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filter.bonds.length > 0 ? (
            currentBonds.map((bond, bondIndex) => (
              <TableRow key={bondIndex} className="bond-item">
                <TableCell component="th" scope="row">
                  <input
                    type="checkbox"
                    className="bond-checkbox"
                    onChange={() => handleCheckboxChange(bond)}
                    checked={selectedBonds.has(bond.isin)}
                  />
                </TableCell>
                <TableCell align="right">{bond.isin}</TableCell>
                <TableCell align="right">{bond.creditScore}</TableCell>
                <TableCell align="right">{bond.maturityDate}</TableCell>
                <TableCell align="right">
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5">No bonds found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <div className="pagination">
  <button onClick={() => paginate('prev')} disabled={currentPage === 1}>
    Previous
  </button>
  <button onClick={() => paginate('next')} disabled={currentPage === Math.ceil(filter.bonds.length / itemsPerPage)}>
    Next
  </button>
</div>


    </div>
  );
};

export default BondsTable;
