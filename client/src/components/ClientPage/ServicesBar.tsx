import React from 'react';
import { Chip, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import { toTitleCase } from '../../utils/formatting';

interface Props {
  services: string[]
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      color: theme.palette.common.white,
      opacity: 0.8,
      minWidth: 42
    },
    '& > div:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  },
  SEO: {
    // @ts-ignore
    background: theme.palette.services.SEO
  },
  PAID_SEARCH: {
    // @ts-ignore
    background: theme.palette.services.PAID_SEARCH
  },
  PAID_SOCIAL: {
    // @ts-ignore
    background: theme.palette.services.PAID_SOCIAL
  },
  CONTENT: {
    // @ts-ignore
    background: theme.palette.services.CONTENT
  }
}));

const ServicesBar: React.FC<Props> = ({ services }) => {
  const classes = useStyles({});

  return (
    <>
    <Typography variant="overline">
      Services
    </Typography>
    <div className={classes.root}>
      {services.map((service, i) => (
        // @ts-ignore
        <Chip key={i} label={service === 'SEO' ? 'SEO' : toTitleCase(service)} className={classes[service]} />
      ))}
    </div>
    </>
  ); 
};

export default ServicesBar;