import React, { useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Paper } from '@mui/material';
import "./BondsTable.css";
import {
  ITEMS_PER_PAGE,
  MINIMUM_PAGE_COUNT,
  PAGE_COUNT_CHANGE_FACTOR
} from './Constants';

const BondsTable = ({ filter, selectedBonds, handleCheckboxChange, handleThresholdChange, setAllChecbox }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastBond = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBond = indexOfLastBond - ITEMS_PER_PAGE;
  const MIN_BONDS_LENGTH = 0;
  const MIN_THRESHOLD_VALUE = "0";
  const currentBonds = Array.from(filter.bonds.values()).slice(indexOfFirstBond, indexOfLastBond);
  const paginate = (action) => {
    if (action === 'prev' && currentPage > MINIMUM_PAGE_COUNT) {
      setCurrentPage((prevPage) => prevPage - PAGE_COUNT_CHANGE_FACTOR);
    } else if (action === 'next' && currentPage < Math.ceil(filter.bonds.length / ITEMS_PER_PAGE)) {
      setCurrentPage((prevPage) => prevPage + PAGE_COUNT_CHANGE_FACTOR);
    } else {
      setCurrentPage(action);
    }
  };
  
  return (
  <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell align="left" className="table-head-cell">
              <input
                type="checkbox"
                className="bond-checkbox"
                onChange={(e) => setAllChecbox(filter.bonds, e.target.checked)}
              />
            </TableCell>
            <TableCell align="center" className="table-head-cell" style={{ color: 'white' }}>ID</TableCell>
            <TableCell align="center" className="table-head-cell" style={{ color: 'white' }}>Credit Score</TableCell>
            <TableCell align="center" className="table-head-cell" style={{ color: 'white' }}>Maturity</TableCell>
            <TableCell align="center" className="table-head-cell" style={{ color: 'white' }}>Threshold</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filter.bonds.length > MIN_BONDS_LENGTH ? (
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
                <TableCell align="center">{bond.isin}</TableCell>
                <TableCell align="center">{bond.creditScore}</TableCell>
                <TableCell align="center">{bond.maturityDate}</TableCell>
                <TableCell align="center">
                  {selectedBonds.has(bond.isin) &&
                  selectedBonds.get(bond.isin).threshold === '' && (
                    <span style={{ color: 'red', marginLeft: '10px' }}>
                      Please enter threshold
                    </span>
                  )}
                  <input
                    type="number"
                    className="threshold-input"
                    min={MIN_THRESHOLD_VALUE}
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
      <button onClick={() => paginate('next')} disabled={currentPage === Math.ceil(filter.bonds.length / ITEMS_PER_PAGE)}>
        Next
      </button>
    </div>
  </div>
)};

export default BondsTable;
