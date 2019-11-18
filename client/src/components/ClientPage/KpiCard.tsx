import React from 'react';
import { Grid, Typography, Card, CardContent, ListItemText } from '@material-ui/core';
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from 'recharts';
import { useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { sumBy, meanBy, get } from 'lodash';
import clsx from 'clsx';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';

import { getDataFilter } from '../../redux/dataFilter';
import { Kpi } from '../../redux/client';
import { useChartData } from '../../hooks/useChartData';
import { GET_METRIC } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { kpiMetrics }  from '../../utils/constants';
import { getDelta, formatDisplayNumber } from '../../utils/dataTransform';
import { toUpperCase } from '../../utils/formatting';
import LoadingIndicator from '../LoadingIndicator';

interface Props {
  clientId: string;
  kpi: Kpi;
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
    },
    chart: {
      minHeight: 50
    }
  })
);

const KpiCard: React.FC<Props> = ({ clientId, kpi }) => {
  const { datePreset, startDate, endDate } = useSelector(getDataFilter);
  const classes = useStyles();

  const { data, isLoading } = useQuery({
    query: GET_METRIC,
    defaultValue: { current: [], previous: [] },
    options: {
      variables: {
        clientId,
        metric: kpi,
        dates: {
          dateType: toUpperCase(datePreset),
          startDate,
          endDate
        },
        compareDates: {
          dateType: `${toUpperCase(datePreset)}_YOY`,
          startDate,
          endDate
        }
      }
    }
  });

  const chartData = useChartData(kpi.metric, get(data, 'current.data', []), get(data, 'previous.data', []));
 
  // @ts-ignore
  const info = kpiMetrics[kpi.platform].find(n => n.label === kpi.metric) || { prefix: '', suffix: '', aggregate: 'sum' };

  const total = info.aggregate === 'sum' ? sumBy(chartData, kpi.metric) : meanBy(chartData, kpi.metric);
  const prevTotal = info.aggregate === 'sum' ? sumBy(chartData, 'vs Last Year') : meanBy(chartData, 'vs Last Year');
  const delta = getDelta(total, prevTotal);
  const isPositive = parseFloat(delta.toString()) > 0;
  const isNegative = parseFloat(delta.toString()) < 0;

  return (
    <Grid item xs={12} sm={4} md={3} xl={2}>
      <Card>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardContent className={classes.titleContent}>
              <ListItemText primary={kpi.platform} secondary={kpi.platform === 'Google Analytics' ? kpi.channel : "All"} />
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
                  {kpi.metric}
                <span className={classes.value}>
                  {formatDisplayNumber({ value: total, info })}
                </span>
                (<span className={classes.comparison}>
                  {(delta as string).replace('-', '')}
                </span>
                {isPositive ? <ArrowUpward /> : isNegative ? <ArrowDownward /> : null})
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} className={classes.chart}>
            {isLoading ? (
              <LoadingIndicator margin="auto 0 auto 16px" />
            ) : (
              <ResponsiveContainer width="100%" height={52}>
                <AreaChart data={chartData}>
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
                      const options = {
                        style: info.suffix === '%' ? 'percent' : info.prefix === '€' ? 'currency' : 'decimal',
                        currency: 'EUR'
                      };
                      return (value as number).toLocaleString('en-GB', options);
                    }}
                  />
                  <Area type="monotone" dataKey={kpi.metric} stroke="#3367D6" fillOpacity={1} fill="url(#value)" />
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

export default KpiCard;
