import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { GET_CURRENT_USER } from '../../graphql/users';
import useQuery from '../../hooks/useQuery';
import { Box, Typography } from '@material-ui/core';
import AvatarIcon from './AvatarIcon';

interface Props {
  size: 'sm' | 'lg';
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    '& > *:first-child': {
      marginRight: 10
    }
  }
});

const UserAvatar: React.FC<Props> = props => {
  const { data: currentUser } = useQuery({ query: GET_CURRENT_USER, key: 'currentUser' });
  const classes = useStyles(props);

  return (
    <Box display="flex" className={classes.root}>
      <Typography component="span">{currentUser && currentUser.firstName}</Typography>
      {currentUser ? <AvatarIcon user={currentUser} />: <AccountCircle fontSize="large"/>}
    </Box>
  );
};

export default UserAvatar;
