import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Snackbar as MuiSnackbar, SnackbarContent, Slide, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { CheckCircle, Warning, Error, Info, Close } from '@material-ui/icons';

import { getMessages, removeMessage } from '../../redux/api';
import useMediaQuery from '../../hooks/useMediaQuery';

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        top: 12,
        right: 12
      }
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1)
    },
    iconButton: {
      padding: theme.spacing(1)
    },
    success: {
      // @ts-ignore
      backgroundColor: theme.palette.success.main
    },
    warning: {
      // @ts-ignore
      backgroundColor: theme.palette.warning.main
    },
    error: {
      // @ts-ignore
      backgroundColor: theme.palette.error.main
    },
    info: {}
  })
);

const Snackbar: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector(getMessages);
  const classes = useStyles();
  const isSmallScreen = useMediaQuery('sm');

  const handleClose = () => {
    if (messages.length > 0) {
      dispatch(removeMessage(messages[0].id));
    }
  };

  const Icon = messages.length > 0 ? variantIcon[messages[0].type] : variantIcon.info;

  return (
    <MuiSnackbar
      className={classes.root}
      anchorOrigin={isSmallScreen ? {
        vertical: 'bottom',
        horizontal: 'center'
      } : {
        vertical: 'top',
        horizontal: 'right'
      }}
      open={messages.length > 0}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={props => <Slide {...props} direction="left" />}
    >
      {messages.length > 0 ? (
        <SnackbarContent
          aria-describedby="client-snackbar"
          className={classes[messages[0].type]}
          message={
            <span className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {messages[0].message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="close" color="inherit" className={classes.iconButton} onClick={handleClose}>
              <Close className={classes.icon} />
            </IconButton>,
          ]}
        />
      ) : null}
    </MuiSnackbar>
  );
};

export default Snackbar;
