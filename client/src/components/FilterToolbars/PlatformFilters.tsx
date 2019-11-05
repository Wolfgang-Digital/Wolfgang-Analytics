import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { ReduxState } from '../../redux';
import { setPlatform, Platform } from '../../redux/dataFilter';
import Dropdown from '../Dropdown';
import ChannelDropdown from './ChannelDropdown';

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
  }
}));

const FilterToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles({});
  const dataFilter = useSelector((state: ReduxState) => state.dataFilter);

  const handlePlatformChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setPlatform(e.target.value as Platform));
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} className={classes.row}>
        <Dropdown label="Platform" value={dataFilter.platform} handleChange={handlePlatformChange}>
          <MenuItem value="Google Analytics">Google Analytics</MenuItem>
          <MenuItem value="Google Ads">Google Ads</MenuItem>
          <MenuItem value="Facebook Ads">Facebook Ads</MenuItem>
        </Dropdown>
        <ChannelDropdown />
      </Grid>
    </Grid>
  );
};

export default FilterToolbar;
