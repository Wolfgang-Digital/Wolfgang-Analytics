import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ExitIcon from '@material-ui/icons/ExitToApp';
import Profile from '@material-ui/icons/PersonOutline';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';

import { BASE_URL } from '../../utils/constants';
import ClientSelect from '../ClientSelect';
import UserAvatar from '../UserAvatar';
import { Client } from '../../redux/client';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '& > div:first-child': {
      maxWidth: 300,
      marginRight: 'auto'
    }
  },
  button: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: 4
  },
  icon: {
    minWidth: 32
  }
}));

const HeaderMenu: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLinkClick = (location: string) => {
    setAnchorEl(null);
    history.push(location);
  };

  const handleClientSelect = (client: any) => {
    if (client && client.id) history.push(`/c/${client.id}`);
  };

  return (
    <div className={classes.root}>
      <ClientSelect label="Search clients" handleChange={handleClientSelect} />
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        edge="end"
        className={classes.button}
      >
        <UserAvatar size="sm" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleLinkClick('/profile')}>
          <ListItemIcon className={classes.icon}>
            <Profile fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} component="a" href={`${BASE_URL}/auth/logout`}>
          <ListItemIcon className={classes.icon}>
            <ExitIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default HeaderMenu;