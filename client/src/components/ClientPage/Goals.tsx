import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import ga_logo from '../../assets/images/ga_logo.svg';
import { GET_GOAL_COMPLETIONS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getDataFilter } from '../../redux/dataFilter';
import { getClient } from '../../redux/client';
import { toUpperCase } from '../../utils/formatting';
import GoalCard from './GoalCard';
import LoadingIndicator from '../LoadingIndicator';

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

const useStyles = makeStyles({
  title: {
    paddingBottom: '0 !important',
    '& > h2': {
      fontWeight: 500
    }
  },
  titleText: {
    display: 'flex',
    lineHeight: '28px',
    fontSize: 28,
    '& > img': {
      marginRight: 8,
      height: 26
    },
    '& > div:last-child': {
      marginLeft: 10,
      transform: 'translateY(-2px)'
    }
  }
});

const Goals: React.FC = () => {
  const { channel, datePreset, startDate, endDate, applyCustomDate } = useSelector(getDataFilter);
  const client = useSelector(getClient);
  const classes = useStyles();

  const { data, isLoading } = useQuery({
    query: GET_GOAL_COMPLETIONS,
    defaultValue: { current: [], previous: [] },
    options: {
      variables: {
        args: {
          clientId: client.id,
          channel: toUpperCase(channel),
          dateType: toUpperCase(datePreset),
          startDate,
          endDate
        },
        comparisonArgs: {
          clientId: client.id,
          channel: toUpperCase(channel),
          dateType: datePreset === 'Custom' ? 'CUSTOM' : `${toUpperCase(datePreset)}_YOY`,
          startDate,
          endDate
        }
      },
      skip: !client.id || (datePreset === 'Custom' && !applyCustomDate) 
    }
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.title}>
        <Typography component="h2" variant="h4" className={classes.titleText}>
          <img src={ga_logo} alt="GA Logo" />
          Goals
          {isLoading && <LoadingIndicator />}
        </Typography>
      </Grid>
      {data && data.current && data.current.map((goal: Goal, i: number) => (
        <GoalCard key={i} current={goal} previous={data.previous[i]} />
      ))}
      {client.goals.length === 0 && (
        <Grid item xs={12}>
          <Link to={`/clients/${client.id}/settings/3`}>Enable goals for {client.name}</Link>
        </Grid>
      )}
    </Grid>
  );
};

export default Goals;