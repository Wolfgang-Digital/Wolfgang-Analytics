import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { getClient } from '../../redux/client';
import ServicesBar from './ServicesBar';
import Goals from './Goals';

const useStyles = makeStyles((theme: Theme) => createStyles({
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2)
  },
}));

const Overview: React.FC = () => {
  const classes = useStyles();
  const client = useSelector(getClient);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
        <ServicesBar services={client.services} />
      </Grid>
      <Grid item xs={12} sm={12}>
        <Goals clientId={client.id} />
      </Grid>
    </Grid>
  );
};

export default Overview;