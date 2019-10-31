import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import uuid from 'uuid/v4';
import { get } from 'lodash';

import { setIsLoading, removeIsLoading, addMessage } from '../redux/api';

interface Props {
  mutation: any
  key?: string
  defaultValue?: string
  options?: any
}

const useMutationWrapper = ({ mutation, key, defaultValue, options }: Props) => {
  const [loadId, setLoadId] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loadId) setLoadId(uuid());
  }, [loadId]);

  const [mutate, { data, error, loading }] = useMutation(mutation, {
    errorPolicy: 'all',
    ...options
  });

  useEffect(() => {
    if (error) {
      const message = get(error, 'graphQLErrors[0].message', 'An unknown error occured');
      dispatch(addMessage({ id: uuid(), type: 'error', message }));
    }
  }, [error, dispatch]);

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
    data: key ? get(data, key, defaultValue) : data || defaultValue,
    mutate
  };
};

export default useMutationWrapper;