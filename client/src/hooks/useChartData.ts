import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { sumBy, meanBy } from 'lodash';

interface ChartData {
  date: string
  value: number
}

export const useChartData = (label: string, data: ChartData[], dataComparison: ChartData[]) => {
  return useMemo(() => {
    if (!data) return [];
    
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

export const useTotals = (label: string, current: ChartData[], previous: ChartData[]) => {
  return useMemo(() => {
    return {
      current: label === 'Completions' ? sumBy(current, 'value') : (meanBy(current, 'value') / 100).toLocaleString('en-GB', { style: 'percent' }),
      previous: label === 'Completions' ? sumBy(previous, 'value') : (meanBy(previous, 'value') / 100).toLocaleString('en-GB', { style: 'percent' })
    };
  }, [current, previous, label]);
};