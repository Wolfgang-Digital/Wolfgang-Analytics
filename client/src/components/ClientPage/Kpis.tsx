import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { getClient } from '../../redux/client';
import KpiCard from './KpiCard';

const Kpis: React.FC = () => {
  const client = useSelector(getClient);

  return (
    <Grid container spacing={3}>
      {client.kpis.map((kpi, i) => (
        <KpiCard key={i} clientId={client.id} kpi={kpi} />
      ))}
    </Grid>
  );
};

export default Kpis;