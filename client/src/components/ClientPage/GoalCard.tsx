import React, { useMemo } from 'react';
import { Grid, Card, CardContent, Typography, ListItemText } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { sumBy, meanBy } from 'lodash';
import clsx from 'clsx';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';

import { getDelta } from '../../utils/dataTransform';
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
      paddingTop: '4px !important',
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

const useChartData = (label: string, data: Goal['values'], dataComparison: Goal['values']) => {
  return useMemo(() => {
    return data.map(goalData => {
      const date = goalData.date.split('-');
      const regex = `[0-9]...-${date[1]}-${date[2]}`;
      const comparison = dataComparison.find(comparison => !!comparison.date.match(regex));

      return {
        date: format(parseISO(goalData.date), 'do MMM yyyy'),
        [label]: goalData.value,
        'vs Last Year': comparison ? comparison.value : null
      };
    });
  }, [data, dataComparison, label]);
};

const useTotals = (label: string, current: Goal['values'], previous: Goal['values']) => {
  return useMemo(() => {
    return {
      current: label === 'Completions' ? sumBy(current, 'value') : (meanBy(current, 'value') / 100).toLocaleString('en-GB', { style: 'percent' }),
      previous: label === 'Completions' ? sumBy(previous, 'value') : (meanBy(previous, 'value') / 100).toLocaleString('en-GB', { style: 'percent' })
    };
  }, [current, previous, label]);
};

const GoalCard: React.FC<Props> = ({ current, previous }) => {
  const classes = useStyles();
  const data = useChartData(current.metric, current.values, previous.values);
  const totals = useTotals(current.metric, current.values, previous.values);
  // @ts-ignore
  const delta = getDelta(parseFloat(totals.current), parseFloat(totals.previous));
  const isPositive = parseFloat(delta.toString()) > 0;
  const isNegative = parseFloat(delta.toString()) < 0;

  return (
    <Grid item xs={12} sm={4} md={3} xl={2}>
      <Card>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardContent className={classes.titleContent}>
              <ListItemText primary={current.goalName} secondary={`${current.viewName} #${current.goalId}`} />
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
                  {current.metric}
                <span className={classes.value}>
                  {totals.current}
                </span>
                (<span className={classes.comparison}>
                  {(delta as string).replace('-', '')}
                </span>
                {isPositive ? <ArrowUpward /> : isNegative ? <ArrowDownward /> : null})
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <ResponsiveContainer width="100%" height={48}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="value" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007687" stopOpacity={0.66} />
                    <stop offset="95%" stopColor="#007687" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="comparison" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b549d" stopOpacity={0.33} />
                    <stop offset="95%" stopColor="#9b549d" stopOpacity={0} />
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
                <Area type="monotone" dataKey={current.metric} stroke="#007687" fillOpacity={1} fill="url(#value)" />
                <Area type="monotone" dataKey="vs Last Year" stroke="#9b549d" fillOpacity={1} fill="url(#comparison)" />
              </AreaChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
};

export default GoalCard;
