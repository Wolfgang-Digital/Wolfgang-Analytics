import React from 'react';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

interface Props {
  label: string
  link: string
  logo?: string
  logoSize?: number
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      borderRadius: 4,
      height: 100,
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    label: {
      textDecoration: 'none',
      color: 'rgba(0, 0, 0, 0.618)',
      fontSize: 16,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      lineHeight: '15px',
      transition: 'color 200ms ease-in-out',
      '&:hover': {
        color: theme.palette.secondary.light
      }
    },
    logo: ({ logoSize = 18 }: { logoSize?: number }) => ({
      width: logoSize,
      height: logoSize,
      marginRight: theme.spacing(1)
    })
  })
);

const PlaceholderPanel: React.FC<Props> = ({ link, label, logo, logoSize }) => {
  const classes = useStyles({ logoSize });

  return (
    <Grid item xs={12} className={classes.root}>
      <Link to={link} className={classes.label}>
        {logo && <img src={logo} alt="Google Analytics logo" className={classes.logo}/>}
        {label}
      </Link>
    </Grid>
  );
};

export default PlaceholderPanel;
