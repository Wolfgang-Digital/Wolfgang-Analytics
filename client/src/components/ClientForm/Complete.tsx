import React from 'react';
import { Grid, Paper, Typography, TextField } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import { getClient } from '../../redux/client';
import UserSelect from '../UserSelect';
import ServicesBar from '../ClientPage/ServicesBar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up(720 + theme.spacing(2) * 2)]: {
        width: 720,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    submit: {
      display: 'flex',
      '& button': {
        marginLeft: 'auto'
      }
    },
    input: {
      background: '#F2F2F2',
      '& input': {
        color: `${theme.palette.text.secondary}`
      }
    }
  })
);

const TIERS = ['Tier 0', 'Tier I', 'Tier II', 'Tier III', 'Tier IV'];

const Complete: React.FC = () => {
  const client = useSelector(getClient);
  const classes = useStyles({});

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6">
            Complete
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            value={client.name}
            fullWidth
            disabled
            className={classes.input}
            onChange={() => null}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="GA Account"
            variant="outlined"
            value={client.gaAccount}
            fullWidth
            disabled
            className={classes.input}
            onChange={() => null}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Industry"
            variant="outlined"
            value={client.industry}
            fullWidth
            disabled
            className={classes.input}
            onChange={() => null}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Tier"
            variant="outlined"
            value={TIERS[client.tier as number]}
            fullWidth
            disabled
            className={classes.input}
            onChange={() => null}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <UserSelect label="Client Leads" selectedUsers={client.leads} handleChange={e => null} isDisabled />
        </Grid>
        <Grid item xs={12} sm={6}>
          <UserSelect label="Wolfgangers" selectedUsers={client.team} handleChange={e => null} isDisabled />
        </Grid>
        <Grid item xs={12}>
          <ServicesBar services={client.services} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Complete;