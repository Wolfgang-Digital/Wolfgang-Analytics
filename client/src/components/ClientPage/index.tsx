import React, { useEffect } from 'react';
import { useParams, Switch, Route, Link } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { GET_CLIENT_INFO } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { setClient, reset } from '../../redux/client';
import Overview from './Overview';
import Settings from './Settings';

const getSubtitle = (path: string) => {
  if (path.includes('/settings')) {
    return 'Settings';
  }
  return 'Overview';
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(2),
      '& > span': {
        color: theme.palette.text.secondary,
        fontWeight: 300
      }
    },
    links: {
      '& a': {
        textDecoration: 'none'
      },
      '& span': {
        lineHeight: 1.1
      }
    },
    button: {
      color: 'rgba(0, 0, 0, 0.5)'
    },
    activeButton: {
      color: theme.palette.primary.main
    }
  })
);

const ClientPage: React.FC = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const subtitle = getSubtitle(pathname);
  
  const { data } = useQuery({
    query: GET_CLIENT_INFO,
    key: 'client',
    options: {
      variables: { id }
    }
  });

  useEffect(() => {
    if (!!data) {
      dispatch(setClient(data));
    }

    return () => {
      dispatch(reset());
    }
  }, [data, dispatch]);

  return data ? (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={8}>
          <Typography component="h1" variant="h3" className={classes.title}>
            {data.name} <span>- {subtitle}</span>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <Grid container spacing={1} justify="flex-end" className={classes.links}>
            <Grid item>
              <Link to={`/clients/${id}/`}>
                <Button 
                  className={clsx(classes.button, { [classes.activeButton]: subtitle === 'Overview' })} 
                  startIcon={<EqualizerIcon color="inherit" />}
                >
                  Overview
                </Button>
              </Link>
            </Grid>
            <Grid item>
              <Link to={`/clients/${id}/settings/0`}>
                <Button 
                  className={clsx(classes.button, { [classes.activeButton]: subtitle === 'Settings' })}
                  startIcon={<SettingsIcon color="inherit" />}
                >
                  Settings
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`/clients/${id}/`} component={Overview} />
        <Route exact path={`/clients/${id}/settings/:start`} component={Settings} />
      </Switch>
    </>
  ) : null;
};

export default ClientPage;
