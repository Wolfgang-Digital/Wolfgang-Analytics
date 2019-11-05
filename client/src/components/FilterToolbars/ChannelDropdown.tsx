import React from 'react';
import { MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { ReduxState } from '../../redux';
import { setChannel, Channel } from '../../redux/dataFilter';
import Dropdown from '../Dropdown';


const ChannelDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const dataFilter = useSelector((state: ReduxState) => state.dataFilter);

  const handleChannelChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    dispatch(setChannel(e.target.value as Channel));
  };

  return (
    <Dropdown
      label="Channel"
      value={dataFilter.channel}
      handleChange={handleChannelChange}
      isDisabled={dataFilter.platform !== 'Google Analytics'}
    >
      <MenuItem value="All">All</MenuItem>
      <MenuItem value="Organic">Organic</MenuItem>
      <MenuItem value="Paid Search">Paid Search</MenuItem>
      <MenuItem value="Social">Social</MenuItem>
    </Dropdown>
  );
};

export default ChannelDropdown;
