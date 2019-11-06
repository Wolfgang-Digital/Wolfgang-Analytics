import React from 'react';
import { Grid, Typography, Card, CardContent } from '@material-ui/core';
import { ResponsiveContainer, AreaChart, XAxis, Tooltip, Area } from 'recharts';
import { useSelector } from 'react-redux';

import { getDataFilter } from '../../redux/dataFilter';
import { Kpi } from '../../redux/client';
import { useChartData } from '../../hooks/useChartData';
import { GET_METRIC } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';

interface Props {
  clientId: string
  kpi: Kpi
}

const KpiCard: React.FC<Props> = ({ clientId, kpi }) => {
  const { datePreset, startDate, endDate } = useSelector(getDataFilter);

  const { data, isLoading } = useQuery({
    query: GET_METRIC,
    defaultValue: { current: [], previous: [] },
    options: {
      variables: {
        clientId,
        metric: kpi,
        dates: {
          dateType: 'LAST_MONTH',
          startDate,
          endDate
        },
        compareDates: {
          dateType: 'LAST_MONTH_YOY',
          startDate,
          endDate
        }
      }
    }
  });

  //const chartData = useChartData(kpi.metric, data.current, data.previous);
  return null;
  return (
    <Grid item xs={12} sm={4} md={3} xl={2}>
      <Grid item xs={12}>
        <CardContent>
          <ResponsiveContainer width="100%" height={52}>
            <AreaChart data={[]}>
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
              />
              <Area type="monotone" dataKey={kpi.metric} stroke="#3367D6" fillOpacity={1} fill="url(#value)" />
              <Area type="monotone" dataKey="vs Last Year" stroke="#F55D5D" fillOpacity={1} fill="url(#comparison)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Grid>
    </Grid>
  );
};

export default KpiCard;
