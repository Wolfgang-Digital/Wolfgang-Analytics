import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep, omit } from 'lodash';
import { useApolloClient } from '@apollo/react-hooks';
import uuid from 'uuid/v4';

import useMediaQuery from '../../hooks/useMediaQuery';
import useMutation from '../../hooks/useMutation';
import { reset, getClient } from '../../redux/client';
import { ADD_CLIENT } from '../../graphql/clients';
import { addMessage } from '../../redux/api';
import DesktopStepper from '../Steppers/DesktopStepper';
import MobileStepper from '../Steppers/MobileStepper';
import Account from './Account';
import Views from './Views';
import Services from './Services';
import Goals from './Goals';
import Complete from './Complete';
import Kpis from './Kpis';

const STEPS = ['Account', 'Views', 'Services', 'Goals', 'KPIs', 'Complete'];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 0,
      paddingTop: theme.spacing(2)
    },
    container: {
      width: '100%',
      [theme.breakpoints.up(720 + theme.spacing(2) * 2)]: {
        width: 720,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    fullWidth: {
      width: '100%'
    },
    button: {
      marginRight: theme.spacing(1)
    },
    buttonGroup: {
      display: 'flex',
      marginTop: theme.spacing(1),
      '& button:first-child': {
        marginLeft: 'auto'
      },
      '& button:last-child': {
        marginRight: 0
      }
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  })
);

const renderStep = (step: number) => {
  switch (step) {
    case 0:
      return <Account />;

    case 1:
      return <Views />;

    case 2:
      return <Services />;

    case 3:
      return <Goals />;

    case 4:
      return <Kpis />;

    case 5:
      return <Complete />;

    default:
      throw new Error('Invalid step');
  }
};

const ClientForm: React.FC = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const classes = useStyles({ step });
  const isSmallScreen = useMediaQuery('sm');
  const client = useSelector(getClient);
  const apollo = useApolloClient();

  const { mutate, isLoading } = useMutation({
    mutation: ADD_CLIENT,
    key: 'client'
  });

  const addClient = () => {
    const args = cloneDeep(omit(client, ['__typename']));
    // @ts-ignore
    args.leads = args.leads.map(user => user.id);
    // @ts-ignore
    args.team = args.team.map(user => user.id);

    mutate({
      variables: { args },
      update: () => {
        apollo.resetStore();
        window.localStorage.clear();
        dispatch(addMessage({
          id: uuid(),
          type: 'success',
          message: 'Client added successfully'
        }));
      }
    });
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleReset = () => {
    dispatch(reset());
    setStep(0);
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Typography component="h1" variant="h3">
        Add Client
      </Typography>
      {!isSmallScreen && <DesktopStepper step={step} steps={STEPS} />}
      <div className={clsx(classes.container, { [classes.fullWidth]: step === 1 || step === 4 })}>
        {renderStep(step)}
        {!isSmallScreen && (
          <div className={classes.buttonGroup}>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
            <Button disabled={step === 0} onClick={handleBack} className={classes.button}>
              Back
            </Button>
            {step === STEPS.length - 1 ? (
              <Button onClick={addClient} disabled={isLoading} variant="contained" color="secondary">
                Add Client
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
      {isSmallScreen && <MobileStepper step={step} steps={STEPS} handleNext={handleNext} handleBack={handleBack} />}
    </Container>
  );
};

export default ClientForm;
