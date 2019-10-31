import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MenuItem, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateRangeIcon from '@material-ui/icons/DateRange';
import clsx from 'clsx';

import { ReduxState } from '../../redux';
import { setPlatform, setDate, setChannel, Platform, DatePreset, Channel, setCustomDate, applyCustomDate } from '../../redux/dataFilter';
import useMediaQuery from '../../hooks/useMediaQuery';
import Dropdown from '../Dropdown';

const useStyles = makeStyles((theme: Theme) => createStyles({
  row: {
    [theme.breakpoints.up('md')]: {
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
    transform: 'translateY(8px)',
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1)
    }
  }
}));

const FilterToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const dataFilter = useSelector((state: ReduxState) => state.dataFilter);
  const isSmallScreen = useMediaQuery('sm');

  const handlCustomDateChange = (key: 'startDate' | 'endDate', date: Date | null) => {
    if (!date) return;
    const formattedDate = format(date, 'yyyy-MM-dd');
    dispatch(setCustomDate({ key, value: formattedDate }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setPlatform(e.target.value as Platform));
  };

  const handleChannelChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setChannel(e.target.value as Channel));
  };

  const handleDateChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setDate(e.target.value as DatePreset));
  };

  return (
    <>
      <Grid item xs={12} className={classes.row}>
        <Dropdown label="Platform" value={dataFilter.platform} handleChange={handlePlatformChange}>
          <MenuItem value="Google Analytics">Google Analytics</MenuItem>
          <MenuItem value="Google Ads">Google Ads</MenuItem>
          <MenuItem value="Facebook Ads">Facebook Ads</MenuItem>
        </Dropdown>
        <Dropdown
          label="Channel"
          value={dataFilter.channel}
          handleChange={handleChannelChange}
          isDisabled={dataFilter.platform !== 'Google Analytics'}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Organic">Organic</MenuItem>
          <MenuItem value="Paid Search">Paid Search</MenuItem>
          <MenuItem value="Social">Social</MenuItem>
        </Dropdown>
      </Grid>
      <Grid item xs={12} className={clsx(classes.row, classes.dates)}>
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
            endIcon={<DateRangeIcon />}
            disabled={dataFilter.datePreset !== 'Custom'}
            onClick={() => dispatch(applyCustomDate(true))}
          >
            Apply Custom Date
          </Button>
        </MuiPickersUtilsProvider>
      </Grid>
    </>
  );
};

export default FilterToolbar;
