import { createSlice, createSelector, PayloadAction } from 'redux-starter-kit';

export interface ApiMessage {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  message: string
}

export interface ApiState {
  loadIds: string[]
  messages: ApiMessage[]
}

const { actions, reducer } = createSlice({
  slice: 'api',
  initialState: {
    loadIds: [],
    messages: []
  },
  reducers: {
    setIsLoading: (state: ApiState, { payload }: PayloadAction<string>) => {
      state.loadIds.push(payload);
    },

    removeIsLoading: (state: ApiState, { payload }: PayloadAction<string>) => {
      state.loadIds = state.loadIds.filter(id => id !== payload);
    },

    addMessage: (state: ApiState, { payload }: PayloadAction<ApiMessage>) => {
      state.messages.push(payload);
    },

    removeMessage: (state: ApiState, { payload }: PayloadAction<string>) => {
      state.messages = state.messages.filter(message => message.id !== payload);
    }
  }
});

export const getIsLoading = createSelector(
  ({ api }: { api: ApiState }) => api.loadIds,
  (ids) => ids.length > 0
);

export const getMessages = createSelector(
  ({ api }: { api: ApiState }) => api.messages,
  (messages) => messages
);

export const { setIsLoading, removeIsLoading, addMessage, removeMessage } = actions;
export default reducer;