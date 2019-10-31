import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { FormControl, InputLabel, Select } from '@material-ui/core';

interface Props {
  label: string
  value: string | string[]
  styleProps?: any
  isDisabled?: boolean
  multiple?: boolean
  fullWidth?: boolean
  input?: any
  renderValue?: (value: any) => ReactNode
  handleChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: (props?: any) => ({
      margin: theme.spacing(1),
      minWidth: 200,
      marginLeft: 0,
      marginRight: 0,
      ...props,
      [theme.breakpoints.down('sm')]: {
        width: '100%'
      }
    })
  })
);

const Dropdown: React.FC<Props> = ({ label, value, handleChange, isDisabled, children, styleProps = {}, fullWidth, ...rest }) => {
  const classes = useStyles(styleProps);
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl} disabled={isDisabled} fullWidth={fullWidth}>
      <InputLabel ref={inputLabel} htmlFor={`${label}-select`}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        labelWidth={labelWidth}
        inputProps={{
          name: label,
          id: `${label}-select`
        }}
        {...rest}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
