import { useEffect } from 'react';
import { parseISO, isToday, isPast } from 'date-fns';
import { get } from 'lodash';

import { saveState, loadState } from '../utils/storage';
import useQuery from './useQuery';

interface Args {
  name: string
  ignoreCache?: boolean
  queryArgs: {
    query: any
    key?: string
    defaultValue?: any
    options?: any
  }
  dates: {
    startDate: string
    endDate: string
  }
}

interface Cache {
  lastUpdated: string
  startDate: string
  endDate: string
  data: any
}

const useCachedQuery = ({ name, ignoreCache, queryArgs, dates }: Args) => {
  const cache: Cache | null = loadState(name, null);

  const cacheRequiresUpdate = cache ? (!isToday(parseISO(cache.lastUpdated)) && isPast(parseISO(cache.lastUpdated))) : true;
  const skip = queryArgs.options.skip || !cacheRequiresUpdate;
 
  const { data, isLoading, hasError } = useQuery({
    ...queryArgs,
    defaultValue: null,
    options: {
      ...queryArgs.options,
      skip
    }
  });
  
  useEffect(() => {
    if (data && !ignoreCache) {
      saveState(name, {
        lastUpdated: new Date(),
        data,
        ...dates
      });
    }
  }, [name, data]);

  return {
    isLoading,
    hasError,
    data: data || get(cache, 'data', queryArgs.defaultValue)
  };
};

export default useCachedQuery;