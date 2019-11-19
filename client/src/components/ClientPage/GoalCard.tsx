import React from 'react';
import { Grid, Card, CardContent, Typography, ListItemText } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from 'recharts';
import clsx from 'clsx';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';
import { get } from 'lodash';

import { getDelta } from '../../utils/dataTransform';
import { Goal } from './Goals';
import { useChartData, useTotals } from '../../hooks/useChartData';
import LoadingIndicator from '../LoadingIndicator';

interface Props {
  info: any;
  current: Goal;
  previous: Goal;
  isLoading: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleContent: {
      padding: `16px !important`,
      borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
      '& > div': {
        margin: 0
      }
    },
    metricLabel: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      '& svg': {
        fontSize: 18
      }
    },
    valueContainer: {
      paddingBottom: '4px !important',
      paddingTop: '4px !important'
    },
    value: {
      fontSize: 20,
      fontWeight: 300,
      marginLeft: 'auto',
      marginRight: theme.spacing(1)
    },
    comparison: {
      fontSize: 20,
      fontWeight: 400
    },
    red: {
      '& > *:not(:first-child)': {
        color: theme.palette.error.main
      }
    },
    green: {
      '& > *:not(:first-child)': {
        // @ts-ignore
        color: theme.palette.success.main
      }
    }
  })
);

const GoalCard: React.FC<Props> = ({ info, current, previous, isLoading }) => {
  const classes = useStyles();
  const data = useChartData(get(current, 'metric', info.name), get(current, 'values'), get(previous, 'values'));
  const totals = useTotals(get(current, 'metric', info.name), get(current, 'values'), get(previous, 'values'));
  // @ts-ignore
  const delta = getDelta(parseFloat(totals.current), parseFloat(totals.previous));
  const isPositive = parseFloat(delta.toString()) > 0;
  const isNegative = parseFloat(delta.toString()) < 0;

  return (
    <Grid item xs={12} sm={4} md={3}>
      <Card>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardContent className={classes.titleContent}>
              <ListItemText primary={`${current ? current.viewName : info.viewId} (#${info.id})`} />
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent className={classes.valueContainer}>
              <Typography
                className={clsx(classes.metricLabel, {
                  [classes.green]: isPositive,
                  [classes.red]: isNegative
                })}
              >
                {info.name}
                <span className={classes.value}>{totals.current}</span>(
                <span className={classes.comparison}>{(delta as string).replace('-', '')}</span>
                {isPositive ? <ArrowUpward /> : isNegative ? <ArrowDownward /> : null})
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            {isLoading ? (
              <LoadingIndicator margin="auto 0 auto 16px" />
            ) : (
              <ResponsiveContainer width="100%" height={52}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="value" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3367D6" stopOpacity={0.66} />
                      <stop offset="95%" stopColor="#3367D6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="comparison" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F55D5D" stopOpacity={0.33} />
                      <stop offset="95%" stopColor="#F55D5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <Tooltip
                    // @ts-ignore
                    position={{ y: -52 }}
                    allowEscapeViewBox={{ x: false, y: true }}
                    formatter={value => {
                      if (current.metric === 'Conversion Rate') {
                        return (parseFloat(value.toString()) / 100).toLocaleString('en-GB', { style: 'percent' });
                      }
                      return value;
                    }}
                  />
                  <Area type="monotone" dataKey={current.metric} stroke="#3367D6" fillOpacity={1} fill="url(#value)" />
                  <Area type="monotone" dataKey="vs Last Year" stroke="#F55D5D" fillOpacity={1} fill="url(#comparison)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default GoalCard;
