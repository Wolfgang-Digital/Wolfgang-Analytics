import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MenuItem, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';

import { ReduxState } from '../../redux';
import { setDate, DatePreset, setCustomDate, applyCustomDate } from '../../redux/dataFilter';
import useMediaQuery from '../../hooks/useMediaQuery';
import Dropdown from '../Dropdown';
import ChannelDropdown from './ChannelDropdown';

interface Props {
  includeChannelFilter?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  row: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      '& > div': {
        marginRight: theme.spacing(2),
        maxWidth: 200
      },
      '& > div:last-child': {
        marginRight: 'auto'
      }
    }
  },
  dates: {
    [theme.breakpoints.down('sm')]: {
      '& > div:not(:first-child)': {
        width: '50%'
      },
      '& > div:nth-child(2)': {
        paddingRight: 4
      },
      '& > div:nth-child(3)': {
        paddingLeft: 4
      }
    }
  },
  button: {
    height: 42,
    borderRadius: 21,
    marginLeft: 'auto',
    lineHeight: '11px',
    transform: 'translateY(8px)',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1)
    }
  }
}));

const DateFilters: React.FC<Props> = ({ includeChannelFilter }) => {
  const dispatch = useDispatch();
  const classes = useStyles({});
  const dataFilter = useSelector((state: ReduxState) => state.dataFilter);
  const isSmallScreen = useMediaQuery('sm');

  const handlCustomDateChange = (key: 'startDate' | 'endDate', date: Date | null) => {
    if (!date) return;
    const formattedDate = format(date, 'yyyy-MM-dd');
    dispatch(setCustomDate({ key, value: formattedDate }));
  };

  const handleDateChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setDate(e.target.value as DatePreset));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} className={clsx(classes.row, classes.dates)}>
        {includeChannelFilter && <ChannelDropdown />}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Dropdown label="Date Preset" value={dataFilter.datePreset} handleChange={handleDateChange}>
            <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
            <MenuItem value="Last Month">Last Month</MenuItem>
            <MenuItem value="Year to Date">Year to Date</MenuItem>
            <MenuItem value="Custom">Custom</MenuItem>
          </Dropdown>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="dense"
            id="custom-start-date"
            label="Start Date"
            inputVariant="outlined"
            value={dataFilter.startDate}
            onChange={date => handlCustomDateChange('startDate', date)}
            disabled={dataFilter.datePreset !== 'Custom'}
            KeyboardButtonProps={{
              'aria-label': 'change start date'
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            inputVariant="outlined"
            format="dd/MM/yyyy"
            margin="dense"
            id="custom-end-date"
            label="End Date"
            value={dataFilter.endDate}
            onChange={date => handlCustomDateChange('endDate', date)}
            disabled={dataFilter.datePreset !== 'Custom'}
            KeyboardButtonProps={{
              'aria-label': 'change end date'
            }}
          />
          <Button
            className={classes.button}
            fullWidth={isSmallScreen}
            variant="outlined"
            color="primary"
            disabled={dataFilter.datePreset !== 'Custom'}
            onClick={() => dispatch(applyCustomDate(true))}
          >
            Apply Date
          </Button>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
};

export default DateFilters;
