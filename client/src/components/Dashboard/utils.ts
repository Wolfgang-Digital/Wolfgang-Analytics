import clsx from 'clsx';

import { DataFilter } from '../../redux/dataFilter';
import { toUpperCase } from '../../utils/formatting';
import { datePresets, getDatesLastYear } from '../../utils/dates';

interface Header {
  name: string
  options?: any
}

export const generateHeaders = (headers: Header[], classes: Record<string, string>) => {
  return headers.map(({ name, options }) => ({
    name,
    options: {
      ...options,
      setCellProps: (value: string, rowIndex: number, colIndex: number) => {
        return {
          className: clsx(classes.cell, {
            [classes.greenCell]: name === 'Δ%' && parseFloat(value) > 0,
            [classes.redCell]: name === 'Δ%' && parseFloat(value) < 0
          })
        };
      }
    }
  }));
};

const serviceMap = {
  'Organic': 'SEO',
  'Paid Search': 'PAID_SEARCH',
  'Social': 'PAID_SOCIAL'
};

export const getQueryVariables = ({ platform, channel, datePreset, startDate, endDate, industry, tier }: DataFilter) => {
  const services = [];
  if (platform === 'Google Analytics' && channel !== 'All') {
    services.push(serviceMap[channel]);
  } else if (platform === 'Google Ads') {
    services.push('PAID_SEARCH');
  } else if (platform === 'Facebook Ads') {
    services.push('PAID_SOCIAL');
  }

  const variables: any = {
    filters: {
      services,
      platform,
      industry,
      tier
    },
    args: { dateType: toUpperCase(datePreset), startDate, endDate },
    comparisonArgs: {
      dateType: datePreset === 'Custom' ? 'CUSTOM' : `${toUpperCase(datePreset)}_YOY`
    }
  };

  if (datePreset === 'Custom') {
    variables.comparisonArgs = {
      ...variables.comparisonArgs,
      ...getDatesLastYear({ startDate, endDate })
    };
  }

  if (platform === 'Google Analytics') {
    variables.args.channel = toUpperCase(channel);
    variables.comparisonArgs.channel = toUpperCase(channel);
    variables.args.dimensions = [];
    variables.comparisonArgs.dimensions = [];
  }

  if (platform === 'Facebook Ads' && datePreset !== 'Custom') {
    // @ts-ignore
    const dates = datePresets[`${datePreset} YOY`]();
    variables.comparisonArgs.dateType = 'CUSTOM';
    variables.comparisonArgs.startDate = dates.startDate;
    variables.comparisonArgs.endDate = dates.endDate;
  }
  return variables;
};

const convertNum = (num: string | number) => {
  if (num.toString().includes('M')) {
    return parseFloat(num.toString().replace(/,|M/g, '')) * 1000000;
  } else if (num.toString().includes('K')) {
    return parseFloat(num.toString().replace(/,|K/g, '')) * 1000;
  } else {
    return parseFloat(num.toString().replace(/,/g, ''));
  }
};

export const sortTable = (data: any, col: number, order: string) => {
  if (isNaN(parseFloat(data[0].data[col]))) {
    return data.sort((a: any, b: any) => {
      return a.data[col] > b.data[col]
        ? order === 'asc' ? 1 : -1
        : a.data[col] < b.data[col]
          ? order === 'asc' ? -1 : 1
          : 0;
    });
  }

  return data.sort((a: any, b: any) => {
    return convertNum(a.data[col]) > convertNum(b.data[col])
      ? order === 'asc' ? 1 : -1
      : convertNum(a.data[col]) < convertNum(b.data[col])
        ? order === 'asc' ? -1 : 1
        : 0;
  });
};