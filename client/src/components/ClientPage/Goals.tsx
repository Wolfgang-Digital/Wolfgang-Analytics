import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Settings } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import ga_logo from '../../assets/images/ga_logo.svg';
import { GET_GOAL_COMPLETIONS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getDataFilter } from '../../redux/dataFilter';
import { getClient } from '../../redux/client';
import { toUpperCase } from '../../utils/formatting';
import GoalCard from './GoalCard';
import PlaceholderPanel from './PlaceholderPanel';

export interface Goal {
  metric: 'Completions' | 'Conversion Rate';
  viewId: string;
  viewName: string;
  goalId: string;
  goalName: string;
  url?: string;
  values: {
    date: string;
    value: number;
  }[];
}

const useStyles = makeStyles({
  root: {
    marginBottom: 16
  },
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '0 !important'
  },
  editButton: {
    marginLeft: 'auto'
  }
});

const Goals: React.FC = () => {
  const { channel, datePreset, startDate, endDate, applyCustomDate } = useSelector(getDataFilter);
  const client = useSelector(getClient);
  const classes = useStyles();
  const history = useHistory();

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
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12} className={classes.titleBox}>
        <Typography component="h2" variant="h4">
          Goals
        </Typography>
        {client.goals.length > 0 && (
          <Button startIcon={<Settings />} className={classes.editButton} onClick={() => history.push(`/clients/${client.id}/settings/3`)}>
            Edit Goals
          </Button>
        )}
      </Grid>
      {client.goals.map((goal, i: number) => (
        <GoalCard key={i} info={goal} isLoading={isLoading} current={get(data, `current[${i}]`)} previous={get(data, `previous[${i}]`)} />
      ))}
      {client.goals.length === 0 && (
        <PlaceholderPanel label={`Enable Goals for ${client.name}`} link={`/clients/${client.id}/settings/3`} logo={ga_logo} />
      )}
    </Grid>
  );
};

export default Goals;
