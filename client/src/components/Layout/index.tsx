import React, { Suspense } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Switch } from 'react-router-dom';
import clsx from 'clsx';

import { getIsLoading } from '../../redux/api';
import Sidebar from '../Sidebar';
import Snackbar from '../Snackbar';

const useStyles = makeStyles({
  progress: {
    position: 'fixed',
    zIndex: 1500,
    top: 0,
    left: 0,
    right: 0,
    opacity: 0
  },
  visible: {
    opacity: 1
  }
});

const Layout: React.FC = ({ children }) => {
  const isLoading = useSelector(getIsLoading);
  const classes = useStyles({});

  return (
    <>
      <CssBaseline />
      <LinearProgress className={clsx(classes.progress, { [classes.visible]: isLoading })} color="secondary" />
      <Sidebar>
        <Suspense fallback={<span>Loading...</span>}>
          <Switch>{children}</Switch>
        </Suspense>
      </Sidebar>
      <Snackbar />
    </>
  );
};

export default Layout;
