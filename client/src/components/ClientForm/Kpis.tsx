import React, { useState } from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemText, MenuItem, Button, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Delete } from '@material-ui/icons';

import { getClient, addKpi, removeKpi } from '../../redux/client';
import { kpiMetrics } from '../../utils/constants';
import Dropdown from '../Dropdown';

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
  },
  content: {
    padding: theme.spacing(2)
  },
  flexRow: {
    display: 'flex'
  },
  addButton: {
    minWidth: 120,
    height: 41,
    margin: '8px 0 8px 12px'
  }
}));

const Kpis: React.FC = () => {
  const dispatch = useDispatch();
  const client = useSelector(getClient);
  const classes = useStyles();

  const [platform, setPlatform] = useState('Google Analytics');
  const [channel, setChannel] = useState('All');
  const [metric, setMetric] = useState('');

  const handlePlatformChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    if (e.target.value !== platform) {
      setMetric('');
    }
    setPlatform(e.target.value as string);
  };

  const handleChannelChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setChannel(e.target.value as string);
  };

  const handleMetricChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setMetric(e.target.value as string);
  };

  const handleAddKpi = () => {
    dispatch(addKpi({ platform, channel, metric }));
  };

  // @ts-ignore
  const options = kpiMetrics[platform];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={0}>
          <Typography component="h2" variant="h6" className={classes.title}>
            Available Metrics
          </Typography>
          <Grid container spacing={1} className={classes.content}>
            <Grid item xs={6}>
              <Dropdown label="Platform" value={platform} handleChange={handlePlatformChange} fullWidth>
                <MenuItem value="Google Analytics">Google Analytics</MenuItem>
                <MenuItem value="Google Ads">Google Ads</MenuItem>
                <MenuItem value="Facebook Ads">Facebook Ads</MenuItem>
              </Dropdown>
            </Grid>
            <Grid item xs={6}>
              <Dropdown
                label="Channel"
                value={channel}
                handleChange={handleChannelChange}
                isDisabled={platform !== 'Google Analytics'}
                fullWidth
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Organic">Organic</MenuItem>
                <MenuItem value="Paid Search">Paid Search</MenuItem>
                <MenuItem value="Social">Social</MenuItem>
              </Dropdown>
            </Grid>
            <Grid item xs={12} className={classes.flexRow}>
              <Dropdown label="Metric" value={metric} handleChange={handleMetricChange} fullWidth>
                {options.map((metric: any, i: number) => (
                  <MenuItem key={i} value={metric.label}>
                    {metric.label}
                  </MenuItem>
                ))}
              </Dropdown>
              <Button 
                variant="contained" 
                color="secondary" 
                className={classes.addButton} 
                onClick={handleAddKpi}
                disabled={!metric}
              >
                Add Metric
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={0}>
          <Typography component="h2" variant="h6" className={classes.title}>
            Selected Metrics
          </Typography>
          <List>
            {client.kpis.length === 0 && (
              <ListItem>
                <ListItemText primary="No KPIs selected" secondary="Add metrics to trask as KPIs" />
              </ListItem>
            )}
            {client.kpis.map((kpi, i) => (
              <ListItem key={i}>
                <ListItemText 
                  primary={kpi.metric}
                  secondary={kpi.platform === 'Google Analytics' ? `${kpi.platform}: ${kpi.channel}` : kpi.platform}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="remove kpi" onClick={() => dispatch(removeKpi(kpi))}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default Kpis;