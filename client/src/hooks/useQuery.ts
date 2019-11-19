import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import uuid from 'uuid/v4';
import { get } from 'lodash';

import { setIsLoading, removeIsLoading, addMessage } from '../redux/api';
import useThrottle from '../hooks/useThrottle';

interface Props {
  query: any
  key?: string
  defaultValue?: any
  options?: any
}

interface DispatchMessagePayload {
  id: string
  type: 'success' | 'warning' | 'error'
  message: string
}

const useQueryWrapper = ({ query, key, defaultValue, options }: Props) => {
  const [loadId, setLoadId] = useState('');
  const dispatch = useDispatch();

  const throttledDispatchError = useThrottle({
    fn: (payload: DispatchMessagePayload) => dispatch(addMessage(payload)),
    delay: 1000
  });

  const throttledSetIsLoading = useThrottle({
    fn: (id: string) => dispatch(setIsLoading(id))
  });

  const throttledRemoveIsLoading = useThrottle({
    fn: (id: string) => dispatch(removeIsLoading(id)),
    delay: 25
  });

  useEffect(() => {
    if (!loadId) setLoadId(uuid());
  }, [loadId]);
  
  const { data, loading, error } = useQuery(query, {
    errorPolicy: 'all',
    ...options
  });

  useEffect(() => {
    const skipError = options && options.onError;

    if (error && !skipError) {
      const message = get(error, 'graphQLErrors[0].message');
      if (message) throttledDispatchError({ id: uuid(), type: 'error', message });
    }
  }, [error, options, throttledDispatchError]);

  useEffect(() => {
    if (loading && loadId) {
      throttledSetIsLoading(loadId);
    } else if (!loading && loadId) {
      throttledRemoveIsLoading(loadId);
    }
    return () => {
      throttledRemoveIsLoading(loadId);
    }
  }, [loading, throttledRemoveIsLoading, throttledSetIsLoading, loadId]);

  return {
    isLoading: loading,
    hasError: !!error,
    data: key ? get(data, key, defaultValue) : data || defaultValue
  };
};

export default useQueryWrapper;