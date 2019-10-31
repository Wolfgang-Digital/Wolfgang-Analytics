import { format, subMonths, subDays, startOfMonth, endOfMonth, startOfYear, subYears, endOfYear, parseISO } from 'date-fns';

type DatePresets = {
  [key: string]: () => { startDate: string, endDate: string }
}

const last30Days = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(subDays(today, 30), style),
    endDate: format(subDays(today, 1), style)
  };
};

const last30DaysMoM = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(subMonths(subDays(today, 30), 1), style),
    endDate: format(subMonths(subDays(today, 1), 1), style)
  };
};

const last30DaysYoY = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(subYears(subDays(today, 30), 1), style),
    endDate: format(subYears(subDays(today, 1), 1), style)
  };
};

const lastMonth = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(startOfMonth(subMonths(today, 1)), style),
    endDate: format(endOfMonth(subMonths(today, 1)), style)
  };
};

const lastMonthMoM = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(startOfMonth(subMonths(today, 2)), style),
    endDate: format(endOfMonth(subMonths(today, 2)), style)
  };
};

const lastMonthYoY = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(subYears(startOfMonth(subMonths(today, 1)), 1), style),
    endDate: format(subYears(endOfMonth(subMonths(today, 1)), 1), style)
  };
};

const yearToDate = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(startOfYear(today), style),
    endDate: format(subDays(today, 1), style)
  };
};

const lastYear = (style = 'yyyy-MM-dd') => {
  const today = new Date();
  return {
    startDate: format(startOfYear(subYears(today, 1)), style),
    endDate: format(endOfYear(subYears(today, 1)), style)
  };
};

export const formatCustomDate = ({ startDate, endDate }: any) => {
  return {
    startDate: format(parseISO(startDate), 'yyyy-MM-dd'),
    endDate: format(parseISO(endDate), 'yyyy-MM-dd'),
  }
};

export const getDatesLastYear = ({ startDate, endDate }: any) => {
  return {
    startDate: format(subYears(parseISO(startDate), 1), 'yyyy-MM-dd'),
    endDate: format(subYears(parseISO(endDate), 1), 'yyyy-MM-dd'),
  };
};

export const getDisplayDate = (date: string) => {
  return format(parseISO(date), 'do MMM yyyy');
};

export const datePresets: DatePresets = {
  'Last 30 Days': last30Days,
  'Last 30 Days YOY': last30DaysYoY,
  'Last Month': lastMonth,
  'Last Month YOY': lastMonthYoY,
  'Last Month MOM': lastMonthMoM,
  'Last 30 Days MOM': last30DaysMoM,
  'Year to Date': yearToDate,
  'Year to Date YOY': lastYear,
  'Last Year': lastYear
};