import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import data from './data-set.json';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props) {
  const { row } = props;
  const customerName = Object.keys(row)[0];
  const [open, setOpen] = React.useState(false);
  const [rewardPoints, setRewardPoints] = React.useState(0);
  const [expenses, setExpenses] = React.useState(0);
  const classes = useRowStyles();
  let totalAmount = 0;
  let totalRewardPoints = 0;

  useEffect(() => {
      if (totalAmount && totalRewardPoints) {
        setExpenses(totalAmount);
        setRewardPoints(totalRewardPoints);
      }
  }, [totalAmount, totalRewardPoints])

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {Object.keys(row)[0]}
        </TableCell>
        <TableCell align="right">{expenses}</TableCell>
        <TableCell align="right">{rewardPoints}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Transactions
              </Typography>
              {row[customerName].map((customerData, customerIndex) => {
                  let totalMonthlyAmount = 0;
                  let totalMonthlyRewardPoints = 0;

                  return (
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                            <TableRow>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell><b>Description</b></TableCell>
                            <TableCell align="right"><b>Amount ($)</b></TableCell>
                            <TableCell align="right"><b>Reward points</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customerData.map((monthlyData, monthlyIndex) => {
                                const amount = monthlyData.amount;
                                totalMonthlyAmount = totalMonthlyAmount + amount;

                                let reward_100 = 0;
                                let reward_50 = 0;
                                let amount_100 = 0;

                                if (amount > 100) {
                                    amount_100 = amount - 100;
                                    reward_100 =  amount_100 * 2;
                                }

                                if (amount > 50 && amount - amount_100 > 50) {
                                    const amount_50 = amount - amount_100 - 50;
                                    reward_50 = amount_50 * 1;
                                }

                                const individualRewardPoints = reward_50 + reward_100;
                                totalMonthlyRewardPoints = totalMonthlyRewardPoints + individualRewardPoints;

                                if (monthlyIndex === customerData.length - 1) {
                                    totalAmount = totalAmount + totalMonthlyAmount;
                                    totalRewardPoints = totalRewardPoints + totalMonthlyRewardPoints;
                                }

                                return (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {monthlyData.date}
                                        </TableCell>
                                        <TableCell>{monthlyData.description}</TableCell>
                                        <TableCell align="right">{amount}</TableCell>
                                        <TableCell align="right">
                                            {individualRewardPoints}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            <TableRow>
                                <TableCell rowSpan={3} />
                                <TableCell colSpan={1}><b>Total</b></TableCell>
                                <TableCell align="right"><b>{totalMonthlyAmount}</b></TableCell>
                                <TableCell align="right"><b>{totalMonthlyRewardPoints}</b></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                  )
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Customer Name</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">Total Rewards</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <Row row={row} key={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
