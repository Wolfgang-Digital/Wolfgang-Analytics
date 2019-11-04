import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit';
import { omit } from 'lodash';

import { ReduxState } from '.';

export interface View {
  id: string
  name: string
  accountId: string
  webPropertyId: string
  websiteUrl: string
}

export interface Goal {
  id: string
  viewId: string
  name: string
  goalType: 'URL_DESTINATION' | 'VISIT_TIME_ON_SITE' | 'VISIT_NUM_PAGES' | 'EVENT'
  value: number
  isActive?: boolean
  url?: string
}

export interface Kpi {
  type: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  profilePicture?: string
}

export interface Client {
  id: string
  name: string
  services: string[]
  leads: User[]
  team: User[]
  gaAccount: string
  facebookAdsId?: string
  seoMonitorId?: string
  views: View[]
  goals: Goal[]
  kpis: Kpi[]
  tier: number | string
  pagespeedUrls: string[]
  industry: string
  mainViewId?: string
}

export const initialState: Client = {
  id: '',
  name: '',
  services: [],
  leads: [],
  team: [],
  gaAccount: '',
  views: [],
  goals: [],
  kpis: [],
  facebookAdsId: '',
  seoMonitorId: '',
  pagespeedUrls: [],
  tier: '',
  industry: '',
  mainViewId: undefined
};

const { actions, reducer } = createSlice({
  slice: 'client',
  initialState,
  reducers: {
    setGaAccount: (state: Client, { payload }: PayloadAction<string>) => {
      state.gaAccount = payload;
    },

    editUsers: (state: Client, { payload }: PayloadAction<{
      action: string
      key: 'leads' | 'team'
      value?: User
    }>) => {
      if (payload.action === 'SELECT' && payload.value) {
        state[payload.key].push(payload.value);
      } else if (payload.action === 'REMOVE') {
        // @ts-ignore
        state[payload.key] = state[payload.key].filter(user => user.id !== payload.value.id);
      } else if (payload.action === 'CLEAR') {
        state[payload.key] = [];
      }
    },

    addView: (state: Client, { payload }: PayloadAction<View>) => {
      // @ts-ignore
      state.views.push(omit(payload, '__typename'));
    },

    removeView: (state: Client, { payload }: PayloadAction<string>) => {
      state.views = state.views.filter(view => view.id !== payload);
    },

    editName: (state: Client, { payload }: PayloadAction<string>) => {
      state.name = payload;
    },

    toggleService: (state: Client, { payload }: PayloadAction<string>) => {
      if (state.services.includes(payload)) state.services = state.services.filter(s => s !== payload);
      else state.services.push(payload);
    },

    editServiceId: (state: Client, { payload }: PayloadAction<{
      key: 'facebookAdsId' | 'seoMonitorId'
      value: string
    }>) => {
      state[payload.key] = payload.value;
    },

    addPagespeedUrl: (state: Client, { payload }: PayloadAction<string>) => {
      if (payload && !state.pagespeedUrls.includes(payload)) {
        state.pagespeedUrls.push(payload);
      }
    },

    removePagespeedUrl: (state: Client, { payload }: PayloadAction<string>) => {
      state.pagespeedUrls = state.pagespeedUrls.filter(url => url !== payload);
    },

    setTier: (state: Client, { payload }: PayloadAction<number>) => {
      state.tier = payload;
    },

    toggleGoal: (state: Client, { payload }: PayloadAction<Goal>) => {
      if (!!state.goals.find(goal => goal.viewId === payload.viewId && goal.id === payload.id)) {
        state.goals = state.goals.filter(goal => goal.viewId !== payload.viewId || goal.id !== payload.id);
      } else {
        // @ts-ignore
        state.goals.push(omit(payload, '__typename'));
      }
    },

    setIndustry: (state: Client, { payload }: PayloadAction<string>) => {
      state.industry = payload;
    },

    setMainViewId: (state: Client, { payload }: PayloadAction<string>) => {
      if (state.mainViewId === payload) state.mainViewId = '';
      else state.mainViewId = payload;
    },

    setClient: (state: Client, { payload }: PayloadAction<Client>) => {
      state = Object.entries(payload).reduce((result, [key, value])=> {
        if (key === '__typename') return result;

        if (key === 'views') {
          result.views = value.map((view: View) => omit(view, ['__typename']));
          return result;
        }

        // @ts-ignore
        state[key] = value;
        return result;
      }, state);
    },

    reset: (state: Client) => {
      state.id = '';
      state.name = '';
      state.services = [];
      state.gaAccount = '';
      state.goals = [];
      state.views = [];
      state.kpis = [];
      state.team = [];
      state.leads = [];
      state.pagespeedUrls = [];
      state.facebookAdsId = '';
      state.tier = '';
      state.industry = '';
      state.mainViewId = undefined;
    }
  }
});

export const getClient = createSelector(
  (state: ReduxState) => state.client,
  (client) => client
);

export const { 
  setGaAccount, 
  editUsers, 
  addView, 
  removeView, 
  editName, 
  reset, 
  toggleService,
  editServiceId,
  addPagespeedUrl,
  removePagespeedUrl,
  setTier,
  toggleGoal,
  setIndustry,
  setMainViewId,
  setClient
} = actions;
export default reducer;