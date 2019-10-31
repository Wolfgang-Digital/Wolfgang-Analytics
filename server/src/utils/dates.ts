import { format, subMonths, subDays, startOfMonth, endOfMonth, startOfYear, subYears, endOfYear } from 'date-fns';

import { DateType } from '../types';

type ComparisonRanges = 'LAST_30_DAYS_MOM' | 'LAST_30_DAYS_YOY' | 'LAST_MONTH_MOM' | 'LAST_MONTH_YOY' | 'LAST_YEAR' | 'YEAR_TO_DATE_YOY';

type DatePresets = {
  [key in Exclude<DateType, 'CUSTOM'> | ComparisonRanges]: () => { startDate: string, endDate: string }
}

const last30Days = () => {
  const today = new Date();
  return {
    startDate: format(subDays(today, 30), 'YYYY-MM-DD'),
    endDate: format(subDays(today, 1), 'YYYY-MM-DD')
  };
};

const last30DaysMoM = () => {
  const today = new Date();
  return {
    startDate: format(subMonths(subDays(today, 30), 1), 'YYYY-MM-DD'),
    endDate: format(subMonths(subDays(today, 1), 1), 'YYYY-MM-DD')
  };
};

const last30DaysYoY = () => {
  const today = new Date();
  return {
    startDate: format(subYears(subDays(today, 30), 1), 'YYYY-MM-DD'),
    endDate: format(subYears(subDays(today, 1), 1), 'YYYY-MM-DD')
  };
};

const lastMonth = () => {
  const today = new Date();
  return {
    startDate: format(startOfMonth(subMonths(today, 1)), 'YYYY-MM-DD'),
    endDate: format(endOfMonth(subMonths(today, 1)), 'YYYY-MM-DD')
  };
};

const lastMonthMoM = () => {
  const today = new Date();
  return {
    startDate: format(startOfMonth(subMonths(today, 2)), 'YYYY-MM-DD'),
    endDate: format(endOfMonth(subMonths(today, 2)), 'YYYY-MM-DD')
  };
};

const lastMonthYoY = () => {
  const today = new Date();
  return {
    startDate: format(subYears(startOfMonth(subMonths(today, 1)), 1), 'YYYY-MM-DD'),
    endDate: format(subYears(endOfMonth(subMonths(today, 1)), 1), 'YYYY-MM-DD')
  };
};

const yearToDate = () => {
  const today = new Date();
  return {
    startDate: format(startOfYear(today), 'YYYY-MM-DD'),
    endDate: format(subDays(today, 1), 'YYYY-MM-DD')
  };
};

const yearToDateYoY = () => {
  const today = new Date();
  return {
    startDate: format(startOfYear(subYears(today, 1)), 'YYYY-MM-DD'),
    endDate: format(subYears(subDays(today, 1), 1), 'YYYY-MM-DD')
  };
};

const lastYear = () => {
  const today = new Date();
  return {
    startDate: format(startOfYear(subYears(today, 1)), 'YYYY-MM-DD'),
    endDate: format(endOfYear(subYears(today, 1)), 'YYYY-MM-DD')
  };
};

export const datePresets: DatePresets = {
  LAST_30_DAYS: last30Days,
  LAST_30_DAYS_MOM: last30DaysMoM,
  LAST_30_DAYS_YOY: last30DaysYoY,
  LAST_MONTH: lastMonth,
  LAST_MONTH_MOM: lastMonthMoM,
  LAST_MONTH_YOY: lastMonthYoY,
  YEAR_TO_DATE: yearToDate,
  YEAR_TO_DATE_YOY: yearToDateYoY,
  LAST_YEAR: lastYear
};