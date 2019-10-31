import React, { useState } from 'react';
import { Grid, Paper, Typography, TextField, IconButton } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import Add from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import { getClient, toggleService, editServiceId, addPagespeedUrl, removePagespeedUrl } from '../../redux/client';

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
    bordered: {
      borderTop: '1px solid rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    },
    formGroup: {
      justifyContent: 'space-between'
    },
    inputs: {
      '& > .MuiFormControl-root:first-child': {
        marginTop: theme.spacing(2)
      },
      '& > .MuiFormControl-root:not(:last-child)': {
        marginBottom: theme.spacing(3)
      }
    },
    iconButton: {
      padding: 10,
      marginLeft: theme.spacing(1)
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2)
    },
    listIcon: {
      fontSize: 16
    },
    listButton: {
      padding: 8
    }
  })
);

const Services: React.FC = () => {
  const [url, setUrl] = useState('');
  const classes = useStyles({});
  const dispatch = useDispatch();
  const client = useSelector(getClient);

  const handleToggleService = (service: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleService(service));
  };

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    dispatch(editServiceId({ key: target.name, value: target.value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') handleAddUrl();
  };

  const handleAddUrl = () => {
    dispatch(addPagespeedUrl(url));
    setUrl('');
  }

  const handleRemoveUrl = (value: string) => dispatch(removePagespeedUrl(value));

  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography component="h2" variant="h6">
            Services
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.bordered}>
          <FormGroup row className={classes.formGroup}>
            <FormControlLabel
              control={<Switch checked={client.services.includes('SEO')} onChange={handleToggleService('SEO')} value="SEO" />}
              label="SEO"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={client.services.includes('PAID_SEARCH')}
                  onChange={handleToggleService('PAID_SEARCH')}
                  value="PAID_SEARCH"
                />
              }
              label="Paid Search"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={client.services.includes('PAID_SOCIAL')}
                  onChange={handleToggleService('PAID_SOCIAL')}
                  value="PAID_SOCIAL"
                />
              }
              label="Paid Social"
            />
            <FormControlLabel
              control={<Switch checked={client.services.includes('CONTENT')} onChange={handleToggleService('CONTENT')} value="CONTENT" />}
              label="Content"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup className={classes.inputs}>
            <TextField
              value={client.facebookAdsId || ''}
              variant="outlined"
              id="facebookAdsId"
              name="facebookAdsId"
              label="Facebook Ads ID"
              fullWidth
              onChange={handleInputChange}
              helperText="Facebook ID in the format act_1234567890"
            />
            <TextField
              value={client.seoMonitorId || ''}
              variant="outlined"
              id="seoMonitorId"
              name="seoMonitorId"
              label="SEO Monitor ID"
              fullWidth
              onChange={handleInputChange}
              helperText="5 digit ID can be found in the URL of the SEO Monitor account"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h3" variant="h6">
            Page Speed Insights
          </Typography>
          <List dense disablePadding>
            {client.pagespeedUrls.length === 0 && (
              <ListItem>
                <ListItemText primary="No URLs" secondary="Add urls to track using Google's Page Speed Insights below" />
              </ListItem>
            )}
            {client.pagespeedUrls.map(url => (
              <ListItem key={url}>
                <ListItemText secondary={url} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" className={classes.listButton} onClick={() => handleRemoveUrl(url)}>
                    <DeleteIcon className={classes.listIcon} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <div className={classes.flex}>
            <TextField
              type="url"
              value={url}
              variant="outlined"
              id="pagespeedUrl"
              name="pagespeedUrl"
              label="Page Speed URL"
              fullWidth
              onChange={({ target }) => setUrl(target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton className={classes.iconButton} aria-label="pagespeed url" onClick={handleAddUrl}>
              <Add scale={12} />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Services;
