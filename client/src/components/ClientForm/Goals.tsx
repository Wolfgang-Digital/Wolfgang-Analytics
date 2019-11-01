import React from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { omit } from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';

import { GET_GOALS_FROM_VIEWS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import { getClient, Goal, toggleGoal } from '../../redux/client';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up(720 + theme.spacing(2) * 2)]: {
        width: 720,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
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
    }
  })
);

const Goals: React.FC = () => {
  const dispatch = useDispatch();
  const client = useSelector(getClient);
  const classes = useStyles();

  const goals = useQuery({
    query: GET_GOALS_FROM_VIEWS,
    key: 'goals',
    defaultValue: [],
    options: {
      variables: {
        email: client.gaAccount,
        viewIds: client.views.map(view => omit(view, ['name', 'websiteUrl', '__typename']))
      },
      skip: !!!client.gaAccount
    }
  });

  const handleToggleGoal = (goal: Goal) => {
    dispatch(toggleGoal(goal));
  };

  const isChecked = (goal: Goal) => {
    return !!client.goals.find(g => g.viewId === goal.viewId && g.id === goal.id);
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6">
            GA Goals
          </Typography>
          <List className={classes.list}>
            {goals.data.length === 0 &&  (
              <ListItem>
                <ListItemText primary="No available goals" />
              </ListItem>
            )}
            {goals.data.map((goal: Goal) => (
              <ListItem key={`${goal.viewId}-${goal.id}`}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isChecked(goal)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': `${goal.viewId}-${goal.id}` }}
                    onChange={() => handleToggleGoal(goal)}
                  />
                </ListItemIcon>
                <Tooltip title={`View ID: ${goal.viewId} - Goal Number: ${goal.id}`} placement="top-start">
                  <ListItemText id={`${goal.viewId}-${goal.id}`} primary={goal.name} secondary={goal.url} />
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Goals;
