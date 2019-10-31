import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

interface Props {
  step: number
  steps: string[]
  handleNext: () => void
  handleBack: () => void
}

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
});

const MobileStepper: React.FC<Props> = ({ step, steps, handleNext, handleBack }) => {
  const classes = useStyles({});
  const theme = useTheme();

  return (
    <Stepper
      variant="dots"
      steps={steps.length}
      position="static"
      activeStep={step}
      className={classes.root}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={step === steps.length}>
          Next
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </Button>
      }
      backButton={
        <Button size="small" onClick={handleBack} disabled={step === 0}>
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
          Back
        </Button>
      }
    />
  );
};

export default MobileStepper;