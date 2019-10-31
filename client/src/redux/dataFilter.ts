import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit';
import { format } from 'date-fns';
import { ReduxState } from '.';

export type Platform = 'Google Analytics' | 'Google Ads' | 'Facebook Ads';
export type Channel = 'All' | 'Organic' | 'Paid Search' | 'Social';
export type DatePreset = 'Last 30 Days' | 'Last Month' | 'Year to Date' | 'Custom';
export type ComparisonPeriod = 'Previous Period' | 'Last Year';

export interface DataFilter {
  platform: Platform
  channel: Channel
  datePreset: DatePreset
  showFullValues: boolean
  startDate: string
  endDate: string
  industry: string
  tier: number
  applyCustomDate: boolean
}

const initialState: DataFilter = {
  platform: 'Google Analytics',
  channel: 'All',
  datePreset: 'Last 30 Days',
  showFullValues: false,
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate: format(new Date(), 'yyyy-MM-dd'),
  industry: 'None',
  applyCustomDate: false,
  tier: 0
};

const { actions, reducer } = createSlice({
  slice: 'dataFilter',
  initialState,
  reducers: {
    setPlatform: (state: DataFilter, { payload }: PayloadAction<Platform>) => {
      state.platform = payload;
    },

    setDate: (state: DataFilter, { payload }: PayloadAction<DatePreset>) => {
      state.datePreset = payload;
    },

    setChannel: (state: DataFilter, { payload }: PayloadAction<Channel>) => {
      state.channel = payload;
    },

    setShowFullValues: (state: DataFilter, { payload }: PayloadAction<boolean>) => {
      state.showFullValues = payload;
    },

    setIndustry: (state: DataFilter, { payload }: PayloadAction<string>) => {
      state.industry = payload;
    },

    setCustomDate: (state: DataFilter, { payload }: PayloadAction<{
      key: 'startDate' | 'endDate'
      value: string
    }>) => {
      state[payload.key] = payload.value;
      state.applyCustomDate = false;
    },

    applyCustomDate: (state: DataFilter, { payload }: PayloadAction<boolean>) => {
      state.applyCustomDate = payload;
    },
    
    setTier: (state: DataFilter, { payload }: PayloadAction<number>) => {
      state.tier = payload;
    }
  }
});

export const getDataFilter = createSelector(
  (state: ReduxState) => state.dataFilter,
  (dataFilter) => dataFilter
);

export const { 
  setPlatform, 
  setDate, 
  setChannel, 
  setShowFullValues, 
  setCustomDate, 
  setIndustry, 
  applyCustomDate,
  setTier
} = actions;
export default reducer;