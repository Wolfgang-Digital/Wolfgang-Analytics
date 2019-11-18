import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { getClient } from '../../redux/client';
import KpiCard from './KpiCard';

const Kpis: React.FC = () => {
  const client = useSelector(getClient);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography component="h2" variant="h4">
          KPIs
        </Typography>
      </Grid>
      {client.kpis.map((kpi, i) => (
        <KpiCard key={i} clientId={client.id} kpi={kpi} />
      ))}
    </Grid>
  );
};

export default Kpis;