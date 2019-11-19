import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { sumBy, meanBy } from 'lodash';

interface ChartData {
  date: string
  value: number
}

export const useChartData = (label: string, data?: ChartData[], dataComparison?: ChartData[]) => {
  return useMemo(() => {
    if (!data) return [];
    
    return data.map(entry => {
      const date = entry.date.split('-');
      const regex = `[0-9]...-${date[1]}-${date[2]}`;
      const comparison = dataComparison 
        ? dataComparison.find(comparison => !!comparison.date.match(regex)) 
        : { date: `${parseInt(date[0]) - 1}-${date[1]}-${date[2]}`, value: 0 };

      return {
        date: format(parseISO(entry.date), 'do MMM yyyy'),
        [label]: entry.value,
        'vs Last Year': comparison ? comparison.value : 0
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