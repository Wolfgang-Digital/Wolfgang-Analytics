import React from 'react';
import { Grid, Typography, Button, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Settings } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import targets_icon from '../../assets/images/targets_icon.png';
import { getClient } from '../../redux/client';
import KpiCard from './KpiCard';
import PlaceholderPanel from './PlaceholderPanel';

const useStyles = makeStyles({
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '0 !important'
  },
  editButton: {
    marginLeft: 'auto'
  }
});

const Kpis: React.FC = () => {
  const client = useSelector(getClient);
  const classes = useStyles();
  const history = useHistory();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.titleBox}>
        <Typography component="h2" variant="h4">
          KPIs
        </Typography>
        {client.kpis.length > 0 && (
          <Button startIcon={<Settings />} className={classes.editButton} onClick={() => history.push(`/clients/${client.id}/settings/4`)}>
            Edit KPIs
          </Button>
        )}
      </Grid>
      {client.kpis.length === 0 && (
        <PlaceholderPanel
          label={`Enable KPIs for ${client.name}`}
          link={`/clients/${client.id}/settings/4`}
          logo={targets_icon}
          logoSize={32}
        />
      )}
      {client.kpis.map((kpi, i) => (
        <KpiCard key={i} clientId={client.id} kpi={kpi} />
      ))}
    </Grid>
  );
};

export default Kpis;
