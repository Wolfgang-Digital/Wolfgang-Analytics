import React from 'react';
import { Grid, TextField, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { INDUSTRIES } from '../../utils/constants';
import { getDataFilter, setIndustry, setTier } from '../../redux/dataFilter';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
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
}));

const ClientFilter: React.FC = () => {
  const dispatch = useDispatch();
  const dataFilter = useSelector(getDataFilter);
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.root}>
      <TextField
        label="Industry"
        variant="outlined"
        value={dataFilter.industry}
        onChange={({ target }) => dispatch(setIndustry(target.value))}
        select
        fullWidth
      >
        <MenuItem value="None">No Filter</MenuItem>
        {INDUSTRIES.map(industry => (
          <MenuItem key={industry} value={industry}>
            {industry}
          </MenuItem>
        ))}
        <MenuItem value="Other">Other</MenuItem>
      </TextField>
      <TextField
        label="Tier"
        variant="outlined"
        value={dataFilter.tier}
        onChange={({ target }) => dispatch(setTier(parseInt(target.value)))}
        select
        fullWidth
      >
        <MenuItem value={0}>No Filter</MenuItem>
        <MenuItem value={1}>Tier I</MenuItem>
        <MenuItem value={2}>Tier II</MenuItem>
        <MenuItem value={3}>Tier III</MenuItem>
        <MenuItem value={4}>Tier IV</MenuItem>
      </TextField>
    </Grid>
  );
};

export default ClientFilter;
