import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { MenuItem, Button, Paper } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import { INDUSTRIES, BASE_URL } from '../../utils/constants';
import { GET_GA_ACCOUNTS } from '../../graphql/clients';
import { getClient, setGaAccount, editUsers, User, editName, setTier, setIndustry } from '../../redux/client';
import useQuery from '../../hooks/useQuery';
import UserSelect from '../UserSelect';

interface Props {
  disableAccountChange?: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      [theme.breakpoints.up(720 + theme.spacing(2) * 2)]: {
        width: 720,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    button: {
      height: 42,
      [theme.breakpoints.down('xs')]: {
        height: 'auto',
        marginBottom: theme.spacing(2)
      }
    }
  })
);

const Account: React.FC<Props> = ({ disableAccountChange }) => {
  const dispatch = useDispatch();
  const { data: accounts } = useQuery({
    query: GET_GA_ACCOUNTS,
    key: 'accounts',
    defaultValue: []
  });
  const client = useSelector(getClient);
  const classes = useStyles();

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setGaAccount(e.target.value));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editName(e.target.value));
  };

  const handleUserChange = (e: { action: string; value?: User }, key: string) => {
    dispatch(editUsers({ key: key as 'leads' | 'team', ...e }));
  };

  const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTier(parseInt(e.target.value)));
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIndustry(e.target.value));
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6">
            Account Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={client.name}
            variant="outlined"
            required
            id="name"
            name="name"
            label="Client Name"
            fullWidth
            onChange={handleNameChange}
            helperText="Enter the client's organisation name"
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField 
            label="Industry" 
            variant="outlined" 
            value={client.industry} 
            onChange={handleIndustryChange} 
            select 
            required 
            fullWidth
            helperText="Select the client's industry"
          >
            {INDUSTRIES.map(industry => (
              <MenuItem value={industry} key={industry}>{industry}</MenuItem>
            ))}
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Client Tier" variant="outlined" value={client.tier} onChange={handleTierChange} select required fullWidth>
            <MenuItem value={1}>Tier I</MenuItem>
            <MenuItem value={2}>Tier II</MenuItem>
            <MenuItem value={3}>Tier III</MenuItem>
            <MenuItem value={4}>Tier IV</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="GA Account"
            variant="outlined"
            value={client.gaAccount}
            onChange={handleAccountChange}
            select
            required
            fullWidth
            disabled={disableAccountChange}
            helperText="Select an existing GA account or add a new one"
          >
            {accounts.map((email: string) => (
              <MenuItem key={email} value={email}>
                {email}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            component="a"
            href={`${BASE_URL}/auth/account/register`}
            variant="contained"
            className={classes.button}
            fullWidth
            disabled={disableAccountChange}
            color="primary"
          >
            Add Account
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <UserSelect isMulti label="Client Leads" selectedUsers={client.leads} handleChange={e => handleUserChange(e, 'leads')} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <UserSelect isMulti label="Wolfgangers" selectedUsers={client.team} handleChange={e => handleUserChange(e, 'team')} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Account;
