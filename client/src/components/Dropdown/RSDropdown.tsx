import React from 'react';
import Select from 'react-select';
import { useTheme, Theme } from '@material-ui/core/styles';

type SelectValue = {
  label: string
  value: any
}

interface Props {
  value?: SelectValue | SelectValue[]
  defaultValue?: SelectValue
  options: SelectValue[]
  placeholder?: string
  isMulti?: boolean
  isSearchable?: boolean
  isClearable?: boolean
  isLoading?: boolean
  handleChange: (e: any) => void
}

const handleMultiSelect = ({ action, option, removedValue }: any, handleChange: Function) => {
  if (action === 'select-option') {
    handleChange({ action: 'SELECT', value: option.value });
  } else if (action === 'remove-value') {
    handleChange({ action: 'REMOVE', value: removedValue.value });
  } else if (action === 'clear') {
    handleChange({ action: 'CLEAR' });
  }
};

const handleSelect = ({ action }: any, option: any, handleChange: Function) => {
  if (action === 'select-option') {
    handleChange(option.value);
  } else if (action === 'clear') {
    handleChange(null);
  }
};

const styles = {
  container: (base: any) => ({
    ...base,
    width: '100%'
  }),
  control: (base: any) => ({
    ...base,
    minHeight: 42
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'rgba(0, 0, 0, 0.54)',
    padding: 0,
    fontSize: 16,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: '0.00938em'
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.66)'
  }),
  loadingIndicator: (base: any) => ({
    ...base,
    color: '#9b549d'
  })
};

const getTheme = (base: any, theme: Theme) => ({
  ...base,
  colors: {
    ...base.colors,
    primary: theme.palette.primary.main,
    primary25: theme.palette.primary.light,
    neutral80: theme.palette.text.primary
  }
});

const RSDropdown: React.FC<Props> = ({ handleChange, isMulti, ...rest }) => {
  const theme = useTheme();

  return (
    <Select
      getOptionValue={e => e.value.id}
      isMulti={isMulti}
      onChange={isMulti ?
        (options: any, action: any) => handleMultiSelect(action, handleChange) :
        (option: any, action: any) => handleSelect(action, option, handleChange)
      }
      styles={styles}
      theme={base => getTheme(base, theme)}
      {...rest}
    />
  );
};

export default RSDropdown;