import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { User } from '../../redux/client';
import AvatarIcon from '../UserAvatar/AvatarIcon';

interface Props {
  leads: User[]
  team: User[]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      '& > *:not(:first-child)': {
        marginLeft: theme.spacing(0.5)
      }
    },
    title: {
      fontWeight: 500,
      textAlign: 'right'
    }
  })
);

const UsersBar: React.FC<Props> = ({ leads, team }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography component="h4" variant="overline" className={classes.title}>
          Client Leads
        </Typography>
        <div className={classes.row}>
          {leads.map(user => (
            <Link to={`/users/${user.id}/`} key={user.id}>
              <AvatarIcon user={user} />
            </Link>
          ))}
        </div>
      </Grid>
      <Grid item xs={6}>
        <Typography component="h4" variant="overline" className={classes.title}>
          Wolfgangers
        </Typography>
        <div className={classes.row}>
          {team.map(user => (
            <Link to={`/users/${user.id}/`} key={user.id}>
              <AvatarIcon user={user} />
            </Link>
          ))}
        </div>
      </Grid>
    </Grid>
  );
};

export default UsersBar;
