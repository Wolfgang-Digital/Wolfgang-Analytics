import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { getClient } from '../../redux/client';
import DateFilters from '../FilterToolbars/DateFilters';
import ServicesBar from './ServicesBar';
import UsersBar from './UsersBar';
import Goals from './Goals';
import Kpis from './Kpis';

const useStyles = makeStyles((theme: Theme) => createStyles({
  row: {
    marginBottom: theme.spacing(2)
  },
}));

const Overview: React.FC = () => {
  const classes = useStyles();
  const client = useSelector(getClient);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} className={classes.row}>
        <ServicesBar services={client.services} />
      </Grid>
      <Grid item xs={12} sm={6} className={classes.row}>
        <UsersBar leads={client.leads} team={client.team} />
      </Grid>
      <Grid item xs={12}>
        <DateFilters includeChannelFilter />
      </Grid>
      <Grid item xs={12}>
        <Goals />
      </Grid>
      <Grid item xs={12}>
        <Kpis />
      </Grid>
    </Grid>
  );
};

export default Overview;