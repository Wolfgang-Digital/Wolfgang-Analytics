import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import uuid from 'uuid/v4';
import { get } from 'lodash';

import { setIsLoading, removeIsLoading, addMessage } from '../redux/api';

interface Props {
  query: any
  key?: string
  defaultValue?: any
  options?: any
}

const useQueryWrapper = ({ query, key, defaultValue, options }: Props) => {
  const [loadId, setLoadId] = useState('');
  const dispatch = useDispatch();

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
      const message = get(error, 'graphQLErrors[0].message', 'An unknown error occured');
      dispatch(addMessage({ id: uuid(), type: 'error', message }));
    }
  }, [error, options, dispatch]);

  useEffect(() => {
    if (loading && loadId) {
      dispatch(setIsLoading(loadId));
    } else if (!loading && loadId) {
      dispatch(removeIsLoading(loadId));
    }
    return () => {
      dispatch(removeIsLoading(loadId));
    }
  }, [loading, dispatch, loadId]);

  return {
    isLoading: loading,
    hasError: !!error,
    data: key ? get(data, key, defaultValue) : data || defaultValue
  };
};

export default useQueryWrapper;