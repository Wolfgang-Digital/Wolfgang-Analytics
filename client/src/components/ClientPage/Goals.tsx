import React from 'react';
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { GET_GOAL_COMPLETIONS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getDataFilter } from '../../redux/dataFilter';
import { toUpperCase } from '../../utils/formatting';
import GoalCard from './GoalCard';

export interface Goal {
  viewId: string
  viewName: string
  goalId: string
  goalName: string
  url?: string
  completions: string
  conversionRate: string
}

interface Props {
  clientId: string
}

const Goals: React.FC<Props> = ({ clientId }) => {
  const { channel, datePreset, startDate, endDate } = useSelector(getDataFilter);

  const { data: current } = useQuery({
    query: GET_GOAL_COMPLETIONS,
    key: 'data',
    defaultValue: [],
    options: {
      variables: {
        args: {
          clientId,
          channel: toUpperCase(channel),
          dateType: toUpperCase(datePreset),
          startDate,
          endDate
        }
      }
    }
  });

  const { data: previous } = useQuery({
    query: GET_GOAL_COMPLETIONS,
    key: 'data',
    defaultValue: [],
    options: {
      variables: {
        args: {
          clientId,
          channel: toUpperCase(channel),
          dateType: datePreset === 'Custom' ? 'CUSTOM' : `${toUpperCase(datePreset)}_YOY`,
          startDate,
          endDate
        }
      }
    }
  });

  return (
    <Grid container spacing={3}>
      {current.map((goal: Goal, i: number) => (
        <GoalCard key={i} current={goal} previous={previous[i]} />
      ))}
    </Grid>
  );
};

export default Goals;