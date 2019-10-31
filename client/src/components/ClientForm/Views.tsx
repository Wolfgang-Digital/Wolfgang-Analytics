import React, { useMemo, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
import { includes } from 'lodash';
import { ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { StarBorder, Star } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';

import { GET_GA_PROPERTIES } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getClient, View, addView, removeView, setMainViewId } from '../../redux/client';
import RSDropdown from '../Dropdown/RSDropdown';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      padding: theme.spacing(2)
    },
    title: {
      marginBottom: theme.spacing(2)
    },
    subtitle: {
      fontWeight: 300
    },
    list: {
      maxHeight: 420,
      overflowY: 'auto',
      marginTop: theme.spacing(2),
      marginLeft: -16,
      marginRight: -16,
      marginBottom: theme.spacing(1),
      padding: 0,
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      [theme.breakpoints.down('sm')]: {
        maxHeight: 'fit-content'
      }
    },
    largeList: {
      maxHeight: 480
    },
    closedList: {
      border: 0,
      margin: 0
    },
    star: {
      // @ts-ignore
      color: theme.palette.warning.main
    }
  })
);

const Views: React.FC = () => {
  const dispatch = useDispatch();
  const [property, setProperty] = useState(null);
  const classes = useStyles();
  const client = useSelector(getClient);
  const { data: properties, isLoading } = useQuery({
    query: GET_GA_PROPERTIES,
    key: 'properties',
    defaultValue: [],
    options: {
      variables: { email: client.gaAccount },
      skip: !client.gaAccount
    }
  });

  const propertyOptions = useMemo(() => {
    return properties.map((property: any) => ({
      label: property.name,
      value: property
    }));
  }, [properties]);

  const handlePropertySelect = (property: any) => {
    setProperty(property);
  };

  const handleViewToggle = (view: View) => {
    if (includes(client.views, view)) {
      dispatch(removeView(view.id));
    } else {
      dispatch(addView(view));
    }
  };

  const isChecked = (id: string) => {
    return !!client.views.find(view => view.id === id);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Paper elevation={0} className={classes.paper}>
          <Typography component="h2" variant="h6" className={classes.title}>
            Available Views <span className={classes.subtitle}>- {client.gaAccount}</span>
          </Typography>
          <RSDropdown
            placeholder="GA Property"
            options={propertyOptions}
            handleChange={handlePropertySelect}
            isLoading={isLoading}
            isSearchable
            isClearable
          />
          <List className={clsx(classes.list, { [classes.closedList]: !!!property })}>
            {property &&
              // @ts-ignore
              property.views.map((view: any) => (
                <ListItem key={view.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isChecked(view.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': view.id }}
                      onChange={() => handleViewToggle(view)}
                    />
                  </ListItemIcon>
                  <Tooltip title={`View ID: ${view.id}`} placement="top-start">
                    <ListItemText id={view.id} primary={view.name} secondary={view.websiteUrl} />
                  </Tooltip>
                </ListItem>
              ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={0} className={classes.paper}>
          <Typography component="h2" variant="h6" className={classes.title}>
            Selected Views
          </Typography>
          <List className={clsx(classes.list, classes.largeList)}>
            {client.views.length === 0 && (
              <ListItem>
                <ListItemText primary="No Views Selected" secondary="Select a Property to display availble views" />
              </ListItem>
            )}
            {client.views.map((view: any) => (
              <ListItem key={view.id}>
                <ListItemIcon>
                  <Checkbox 
                    edge="start" 
                    tabIndex={-1} 
                    disableRipple
                    onChange={() => dispatch(setMainViewId(view.id))}
                    checked={client.mainViewId === view.id}
                    color="default"
                    inputProps={{ 'aria-labelledby': `main-view-${view.id}` }}
                    icon={<StarBorder color="action" />}
                    checkedIcon={<Star className={classes.star} />}
                  />
                </ListItemIcon>
                <Tooltip title={`View ID: ${view.id}`} placement="top-start">
                  <ListItemText id={view.id} primary={view.name} secondary={view.websiteUrl} />
                </Tooltip>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="remove view" onClick={() => handleViewToggle(view)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Views;
