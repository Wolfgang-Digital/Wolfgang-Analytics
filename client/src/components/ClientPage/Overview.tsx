import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  subtitle: {
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2)
  },
}));

const Overview: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
    </Grid>
  );
};

export default Overview;