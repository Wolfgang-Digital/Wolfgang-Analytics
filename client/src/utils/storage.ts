import { DataFilter } from '../redux/dataFilter';
import { get } from 'lodash';

export const generateKey = ({ platform, channel, datePreset, industry, tier, filterUser }: DataFilter) => {
  const user = get(filterUser, '[0].id', 'NONE');

  if (platform === 'Google Analytics') {
    return `${platform}:${channel}:${datePreset}:${industry}:${tier}:${user}`;
  } else {
    return `${platform}:${datePreset}:${industry}:${tier}:${user}`;
  }
};

export const saveState = (name: string, state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(name, serializedState);
  } catch {}
};

export const loadState = (name: string, defaultReturn: any) => {
  try {
    const serializedState = localStorage.getItem(name);
    if (serializedState === null) {
      return defaultReturn;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return defaultReturn;
  }
}; 