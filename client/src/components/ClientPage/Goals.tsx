import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import { GET_GOAL_COMPLETIONS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getDataFilter } from '../../redux/dataFilter';
import { toUpperCase } from '../../utils/formatting';
import GoalCard from './GoalCard';

export interface Goal {
  metric: 'Completions' | 'Conversion Rate'
  viewId: string
  viewName: string
  goalId: string
  goalName: string
  url?: string
  values: {
    date: string
    value: number
  }[]
}

interface Props {
  clientId: string
}

const useStyles = makeStyles({
  title: {
    paddingBottom: '0 !important',
    '& > h2': {
      fontWeight: 500
    }
  }
});

const Goals: React.FC<Props> = ({ clientId }) => {
  const { channel, datePreset, startDate, endDate, applyCustomDate } = useSelector(getDataFilter);
  const classes = useStyles();

  const { data } = useQuery({
    query: GET_GOAL_COMPLETIONS,
    defaultValue: { current: [], previous: [] },
    options: {
      variables: {
        args: {
          clientId,
          channel: toUpperCase(channel),
          dateType: toUpperCase(datePreset),
          startDate,
          endDate
        },
        comparisonArgs: {
          clientId,
          channel: toUpperCase(channel),
          dateType: datePreset === 'Custom' ? 'CUSTOM' : `${toUpperCase(datePreset)}_YOY`,
          startDate,
          endDate
        }
      },
      skip: !clientId || (datePreset === 'Custom' && !applyCustomDate) 
    }
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.title}>
        <Typography component="h2" variant="h5">Goals</Typography>
      </Grid>
      {data && data.current && data.current.map((goal: Goal, i: number) => (
        <GoalCard key={i} current={goal} previous={data.previous[i]} />
      ))}
    </Grid>
  );
};

export default Goals;