import React from 'react';

import { User } from '../../redux/client';
import { GET_USERS } from '../../graphql/users';
import useQuery from '../../hooks/useQuery';
import RSDropdown from '../Dropdown/RSDropdown';

interface Props {
  label: string;
  selectedUsers: User[];
  isDisabled?: boolean
  handleChange: (e: { action: string, value?: User }) => void;
}

const UserSelect: React.FC<Props> = ({ label, selectedUsers, handleChange, ...rest }) => {
  const { data: users, isLoading }: { data: User[], isLoading: boolean } = useQuery({
    query: GET_USERS,
    key: 'usernames',
    defaultValue: []
  });

  return (
    <RSDropdown
      placeholder={label}
      options={users.map(user => ({ label: user.firstName, value: user }))}
      value={selectedUsers.map(user => ({ label: user.firstName, value: user }))}
      handleChange={handleChange}
      isMulti
      isSearchable
      isClearable
      isLoading={isLoading}
      {...rest}
    />
  );
};

export default UserSelect;
