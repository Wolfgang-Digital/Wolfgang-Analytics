import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import './styles.css';

interface Props {
  margin?: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 32,
    padding: '16px 4px',
    fontSize: 4,
    textAlign: 'center',
    verticalAlign: 'middle',
    '& > span': {
      background: theme.palette.secondary.main
    },
    '& > span:nth-child(2)': {
      animationDelay: '160ms'
    },
    '& > span:nth-child(3)': {
      animationDelay: '320ms'
    }
  }
}));

const LoadingIndicator: React.FC<Props> = ({ margin }) => {
  const classes = useStyles({});

  return (
    <div className={classes.root} style={{ margin }}>
      <span className="loading-indicator-dot" />
      <span className="loading-indicator-dot" />
      <span className="loading-indicator-dot" />
    </div>
  );
};

export default LoadingIndicator;