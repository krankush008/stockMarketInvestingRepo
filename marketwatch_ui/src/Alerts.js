import React, { useEffect, useState} from 'react'
import './Alerts.css';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

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
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="right">Select</StyledTableCell>
            <StyledTableCell align="right">ID</StyledTableCell>
            <StyledTableCell align="right">Credit Score</StyledTableCell>
            <StyledTableCell align="right">Maturity</StyledTableCell>
            <StyledTableCell align="right">Threshold</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentBonds.map((bond) => (
            <StyledTableRow key={bond.bond.isin} className="bond-row">
              <StyledTableCell component="th" scope="row">
              <label className="bond-checkbox-label">
                  <input
                    type="checkbox"
                    className="bond-checkbox"
                    checked={true}
                    onChange={() => handleCheckboxChange(bond.bond)}
                  />
                </label>
              </StyledTableCell>
              <StyledTableCell align="right">{bond.bond.isin}</StyledTableCell>
              <StyledTableCell align="right">{bond.bond.creditScore}</StyledTableCell>
              <StyledTableCell align="right">{bond.bond.maturityDate}</StyledTableCell>
              <StyledTableCell align="right">{selectedBonds.get(bond.bond.isin).threshold === '' && (
                  <span style={{ color: 'red' }}>Please enter threshold</span>
                )}
                <input
                  type="number"
                  className="threshold-input"
                  min="0"
                  value={selectedBonds.get(bond.bond.isin).threshold}
                  onChange={(e) => handleThresholdChange(bond.bond, e.target.value)}
                /></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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