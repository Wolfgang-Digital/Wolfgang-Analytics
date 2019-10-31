import { configureStore } from 'redux-starter-kit';

import api, { ApiState } from './api';
import dataFilter, { DataFilter } from './dataFilter';
import client, { Client } from './client';

export interface ReduxState {
  api: ApiState
  dataFilter: DataFilter
  client: Client
}

const store = configureStore({
  reducer: {
    api,
    dataFilter,
    client
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;