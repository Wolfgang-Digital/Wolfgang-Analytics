import React from 'react';
import { Avatar } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { User } from '../../redux/client';

interface Props {
  user?: User
  background?: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  avatar: ({ background }: Pick<Props, 'background'>) => ({
    background: background || theme.palette.primary.main,
    height: 32,
    width: 32
  })
}));

const AvatarIcon: React.FC<Props> = ({ user, background }) => {
  const classes = useStyles({ background });

  return user && user.profilePicture ? (
    <Avatar alt="User Avatar" src={user.profilePicture} className={classes.avatar} />
  ) : (
    <Avatar alt="User Avatar" className={classes.avatar}>
      {user && user.firstName.charAt(0)}
    </Avatar>
  );
};

export default AvatarIcon;