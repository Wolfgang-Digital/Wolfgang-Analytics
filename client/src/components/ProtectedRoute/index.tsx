import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import uuid from 'uuid/v4';
import { useDispatch } from 'react-redux';

import { GET_CURRENT_USER } from '../../graphql/users';
import useQuery from '../../hooks/useQuery';
import { setIsLoading, removeIsLoading } from '../../redux/api';

interface Props {
  path: string
  component: any
  exact?: boolean
}

const TIMEOUT_DURATION = 1000;

const ProtectedRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { data: currentUser } = useQuery({ query: GET_CURRENT_USER, key: 'currentUser' });
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    let timeout: any;
    const id = uuid();

    if (!currentUser) {
      dispatch(setIsLoading(id));

      timeout = setTimeout(() => {
        setHasTimedOut(true);
        dispatch(removeIsLoading(id));
      }, TIMEOUT_DURATION);
    }
    return () => {
      clearTimeout(timeout);
      dispatch(removeIsLoading(id));
    }
  }, [currentUser, dispatch]);

  if (!currentUser && !hasTimedOut) return null;

  return (
    <Route
      {...rest}
      render={props => currentUser ?
        <Component {...props} /> :
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      }
    />
  );
};

export default ProtectedRoute;