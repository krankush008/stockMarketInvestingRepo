import React, {useState} from 'react'
import './Alerts.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  ITEMS_PER_PAGE,
  INITIAL_PAGE_NO,
  TABLE_CELL_FONT_SIZE,
  PAGE_COUNT_CHANGE_FACTOR
} from './Constants';

const Alerts = (props) => {
  const {selectedBonds = [], handleThresholdChange, handleCheckboxChange } = props;
  const [currentPage, setCurrentPage] = useState(INITIAL_PAGE_NO);
  const indexOfLastBond = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBond = indexOfLastBond - ITEMS_PER_PAGE;
  const currentBonds = Array.from(selectedBonds.values()).slice(indexOfFirstBond, indexOfLastBond);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: TABLE_CELL_FONT_SIZE,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
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
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        {Array.from({ length: Math.ceil(selectedBonds.size / ITEMS_PER_PAGE) }, (_, index) => (
          <button key={index + PAGE_COUNT_CHANGE_FACTOR} onClick={() => paginate(index + PAGE_COUNT_CHANGE_FACTOR)} className={currentPage === index + PAGE_COUNT_CHANGE_FACTOR ? 'active' : ''}>
            {index + PAGE_COUNT_CHANGE_FACTOR}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Alerts