import React, { useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import People from '@material-ui/icons/People';
import { useLocation } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { PersonAdd } from '@material-ui/icons';

import logo from '../../assets/images/brand_logo_white.png';
import useMediaQuery from '../../hooks/useMediaQuery';
import ListItemLink from './ListItemLink';
import HeaderMenu from './HeaderMenu';

interface StyleProps {
  open: boolean
}

const WIDTH = 220;

export const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    background: '#fff',
    color: theme.palette.text.primary,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    marginLeft: WIDTH,
    width: `calc(100% - ${WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    [theme.breakpoints.down('sm')]: {
      marginRight: 0
    }
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    '& > .MuiPaper-root': {
      backgroundColor: theme.palette.primary.main,
      backgroundImage: `url('https://www.gstatic.com/mobilesdk/190424_mobilesdk/nav_nachos@2x.png'), linear-gradient(to bottom, rgba(0, 82, 94, 0.75), rgba(0, 118, 135, 0.75))`,
      backgroundPosition: 'left 0 bottom 0',
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${WIDTH}px 100%`,
      color: '#fff'
    },
    '& .MuiListItemIcon-root': {
      color: '#f4f4f4'
    },
    '& .MuiIconButton-root': {
      color: 'inherit'
    }
  },
  drawerOpen: {
    width: WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    '& > img': {
      width: 165,
      position: 'relative',
      left: 6
    },
    ...theme.mixins.toolbar
  },
  bottomShadow: {
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)'
  },
  content: ({ open }: StyleProps) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    maxWidth: `calc(100% - ${open ? WIDTH : 74}px)`,
    [theme.breakpoints.down('md')]: {
      maxWidth: '100vw'
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1)
    }
  })
}));

const Sidebar: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles({ open });
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery('md');

  return (
    <div className={classes.root}>
      {location.pathname !== '/login' && (
        <AppBar
          position="fixed"
          elevation={1}
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open
              })}
            >
              <MenuIcon />
            </IconButton>
            <HeaderMenu />
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        hidden={location.pathname.includes('/login')}
        variant={isSmallScreen ? 'temporary' : 'permanent'}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}
        open={open}
      >
        <div className={clsx(classes.toolbar, { [classes.bottomShadow]: open })}>
          <img src={logo} alt="Wolfgang Digital Logo" />
          <IconButton onClick={() => setOpen(false)}>{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
        </div>
        <Divider />
        <List>
          <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon />} />
          <ListItemLink to="/users/" primary="Users" icon={<People />} />
        </List>
        <Divider />
        <List>
          <ListItemLink to="/clients/add-client/" primary="Add Client" icon={<PersonAdd />} />
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        {location.pathname !== '/login/' && <div className={classes.toolbar} />}
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
