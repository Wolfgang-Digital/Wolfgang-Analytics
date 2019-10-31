import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Edit from '@material-ui/icons/Edit';
import { cloneDeep, omit } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/react-hooks';
import uuid from 'uuid/v4';

import { EDIT_CLIENT } from '../../graphql/clients';
import useMediaQuery from '../../hooks/useMediaQuery';
import useMutation from '../../hooks/useMutation';
import { getClient, reset } from '../../redux/client';
import { addMessage } from '../../redux/api';
import DesktopStepper from '../Steppers/DesktopStepper';
import MobileStepper from '../Steppers/MobileStepper';
import Account from '../ClientForm/Account';
import Views from '../ClientForm/Views';
import Services from '../ClientForm/Services';
import Goals from '../ClientForm/Goals';
import Complete from './Complete';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroup: {
      display: 'flex',
      width: '100%',
      '& > *:first-child': {
        marginLeft: 'auto'
      },
      '& > button': {
        marginLeft: theme.spacing(1)
      },
      [theme.breakpoints.up(720 + theme.spacing(2) * 2)]: {
        width: 720,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    fullWidth: {
      width: '100%',
      marginLeft: 0,
      marginRight: 0,
      marginTop: theme.spacing(2)
    }
  })
);

const STEPS = ['Account', 'Views', 'Services', 'Goals', 'Complete'];

const renderStep = (step: number) => {
  switch (step) {
    case 0:
      return <Account disableAccountChange />;

    case 1:
      return <Views />;

    case 2:
      return <Services />;

    case 3:
      return <Goals />;

    case 4:
      return <Complete />;

    default:
      throw new Error('Invalid step');
  }
};

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery('sm');
  const [step, setStep] = useState(0);
  const classes = useStyles();
  const client = useSelector(getClient);
  const apollo = useApolloClient();

  const { mutate, isLoading } = useMutation({
    mutation: EDIT_CLIENT,
    key: 'client'
  });

  const editClient = () => {
    mutate({
      variables: { args: cloneDeep(omit(client, ['goals', 'kpis', '__typename'])) },
      update: () => {
        apollo.resetStore();
        window.localStorage.clear();
        dispatch(addMessage({
          id: uuid(),
          type: 'success',
          message: 'Client updated successfully'
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {!isSmallScreen && <DesktopStepper step={step} steps={STEPS} />}
        {renderStep(step)}
        {!isSmallScreen && (
          <div className={clsx(classes.buttonGroup, { [classes.fullWidth]: step === 1 })}>
            <Button disabled={step === 0} onClick={handleBack}>
              Back
            </Button>
            {step === STEPS.length - 1 ? (
              <Button disabled={isLoading} onClick={editClient} variant="contained" color="secondary" startIcon={<Edit />}>
                Update Client
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        )}
      </Grid>
      {isSmallScreen && <MobileStepper step={step} steps={STEPS} handleNext={handleNext} handleBack={handleBack} />}
    </Grid>
  );
};

export default Settings;
