import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Table from 'mui-datatables';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(2),
      '& > span': {
        color: theme.palette.text.secondary,
        fontWeight: 300
      }
    }
  })
);

const UsersPage: React.FC = () => {
  const classes = useStyles({});

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} lg={8}>
        <Typography component="h1" variant="h3" className={classes.title}>Users</Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={4}></Grid>
    </Grid>
  );
};

export default UsersPage;
