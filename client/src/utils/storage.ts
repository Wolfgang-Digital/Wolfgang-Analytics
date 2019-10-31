import { DataFilter } from '../redux/dataFilter';

export const generateKey = ({ platform, channel, datePreset, industry, tier }: DataFilter) => {
  if (platform === 'Google Analytics') {
    return `${platform}:${channel}:${datePreset}:${industry}:${tier}`;
  } else {
    return `${platform}:${datePreset}:${industry}:${tier}`;
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