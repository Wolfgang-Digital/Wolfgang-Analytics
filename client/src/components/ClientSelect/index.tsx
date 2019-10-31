import React from 'react';

import { Client } from '../../redux/client';
import { GET_CLIENT_SNIPPETS } from '../../graphql/clients';
import useQuery from '../../hooks/useQuery';
import RSDropdown from '../Dropdown/RSDropdown';

interface Props {
  label: string;
  isDisabled?: boolean
  handleChange: (e: { action: string, value?: Client }) => void;
}

const ClientSelect: React.FC<Props> = ({ label, handleChange, ...rest }) => {
  const { data: clients, isLoading }: { data: Client[], isLoading: boolean } = useQuery({
    query: GET_CLIENT_SNIPPETS,
    key: 'clients',
    defaultValue: []
  });

  return (
    <RSDropdown
      placeholder={label}
      options={clients.map(client => ({ label: client.name, value: client }))}
      handleChange={handleChange}
      isSearchable
      isClearable
      isLoading={isLoading}
      {...rest}
    />
  );
};

export default ClientSelect;
