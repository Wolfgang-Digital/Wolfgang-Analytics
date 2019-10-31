import React, { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ArrowUpward, ArrowDownward } from '@material-ui/icons';
import clsx from 'clsx';

import { Platform } from '../../redux/dataFilter';
import { getAverages } from '../../utils/dataTransform';
import { reportMetrics } from '../../utils/constants';
import LoadingIndicator from '../LoadingIndicator';

interface Props {
  platform: Platform
  data: any
  isLoading?: boolean
  hasError?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3)
    },
    card: {
      borderRadius: 2,
      position: 'relative',
      height: '100%'
    },
    cardContent: {
      paddingBottom: `${theme.spacing(2)}px !important`
    },
    title: {
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.75)',
      position: 'relative',
      zIndex: 202
    },
    subtext: {
      fontSize: 14
    },
    metric: {
      fontSize: '2rem',
      color: 'rgba(0, 0, 0, 0.33)'
    },
    green: {
      // @ts-ignore
      color: theme.palette.success.main
    },
    red: {
      // @ts-ignore
      color: theme.palette.error.main
    },
    arrow: {
      fontSize: '2rem',
      transform: 'translateY(4px)'
    },
    decoration: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: -1,
      right: 0,
      background: theme.palette.secondary.light,
      clipPath: 'polygon(100% 0, 75% 100%, 100% 100%)',
      zIndex: 201,
      opacity: 0.66
    },
    decorationAlt: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: theme.palette.primary.light,
      clipPath: 'polygon(100% 0, 75% 0, 100% 50%)',
      zIndex: 200,
      opacity: 0.66
    }
  })
);

const isColour = (colour: 'red' | 'green', metric: any, value: string) => {
  return colour === 'red'
    ? metric.invertColours
      ? parseFloat(value) > 0
      : parseFloat(value) < 0
    : metric.invertColours
    ? parseFloat(value) < 0
    : parseFloat(value) > 0;
};

const Summary: React.FC<Props> = ({ platform, data, isLoading, hasError }) => {
  const classes = useStyles();

  const summary: { [metric: string]: string } = useMemo(() => {
    return getAverages(data);
  }, [data]);

  return (
    <Grid container spacing={4} className={classes.root}>
      {reportMetrics[platform].map(metric => (
        <Grid item xs={12} sm={4} md={3} xl={2} key={metric.key}>
          <Card elevation={1} className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom className={classes.title}>
                {metric.label}
              </Typography>
              {isLoading ? (
                <LoadingIndicator />
              ) : hasError || !data || !summary ? (
                <Typography variant="h3" component="h6" className={classes.metric}>
                  No Data
                </Typography>
              ) : (
                <Typography
                  variant="h3"
                  component="h6"
                  className={clsx(classes.metric, {
                    [classes.green]: isColour('green', metric, summary[metric.key]),
                    [classes.red]: isColour('red', metric, summary[metric.key])
                  })}
                >
                  {summary[metric.key]}
                  {parseFloat(summary[metric.key]) > 0 ? (
                    <ArrowUpward className={classes.arrow} />
                  ) : parseFloat(summary[metric.key]) < 0 ? (
                    <ArrowDownward className={classes.arrow} />
                  ) : null}
                </Typography>
              )}
              <Typography className={classes.subtext} color="textSecondary">
                vs Last Year
              </Typography>
            </CardContent>
            <div className={classes.decorationAlt} />
            <div className={classes.decoration} />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Summary;
