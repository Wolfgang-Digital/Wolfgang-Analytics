import React, { useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { cloneDeep, omit } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useApolloClient } from '@apollo/react-hooks';
import uuid from 'uuid/v4';
import { useParams } from 'react-router-dom';

import { EDIT_CLIENT } from '../../graphql/clients';
import useMediaQuery from '../../hooks/useMediaQuery';
import useMutation from '../../hooks/useMutation';
import { getClient } from '../../redux/client';
import { addMessage } from '../../redux/api';
import DesktopStepper from '../Steppers/DesktopStepper';
import MobileStepper from '../Steppers/MobileStepper';
import Account from '../ClientForm/Account';
import Views from '../ClientForm/Views';
import Services from '../ClientForm/Services';
import Goals from '../ClientForm/Goals';
import Complete from './Complete';
import Kpis from '../ClientForm/Kpis';

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

const STEPS = ['Account', 'Views', 'Services', 'Goals', 'KPIs', 'Complete'];

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
      return <Kpis />

    case 5:
      return <Complete />;

    default:
      throw new Error('Invalid step');
  }
};

const Settings: React.FC = () => {
  const { start } = useParams();
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery('sm');
  const [step, setStep] = useState(parseInt(start || '0'));
  const classes = useStyles();
  const client = useSelector(getClient);
  const apollo = useApolloClient();

  const { mutate, isLoading } = useMutation({
    mutation: EDIT_CLIENT,
    key: 'client'
  });

  const editClient = () => {
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
          <div className={clsx(classes.buttonGroup, { [classes.fullWidth]: step === 1 || step === 4 })}>
            <Button disabled={step === 0} onClick={handleBack}>
              Back
            </Button>
            {step === STEPS.length - 1 ? (
              <Button disabled={isLoading} onClick={editClient} variant="contained" color="secondary">
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
