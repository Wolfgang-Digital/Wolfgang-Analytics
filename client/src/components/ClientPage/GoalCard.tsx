import React from 'react';
import { Grid, Card, CardContent, Typography, ListItemText } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { Goal } from './Goals';

interface Props {
  current: Goal;
  previous: Goal;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleContent: {
      padding: `16px !important`,
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      '& > div': {
        margin: 0
      }
    }
  })
);

const GoalCard: React.FC<Props> = ({ current, previous }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={4} md={3} xl={2}>
      <Card>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardContent className={classes.titleContent}>
              <ListItemText primary={current.goalName} secondary={current.viewName} />
            </CardContent>
          </Grid>
          <Grid item xs={6}>
            <CardContent>
              <Typography>Completions</Typography>
              <Typography>{current.completions}</Typography>
            </CardContent>
          </Grid>
          <Grid item xs={6}>
            <CardContent>
              <Typography>Conversion Rate</Typography>
              <Typography>{current.conversionRate}</Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default GoalCard;
