import React, { useMemo } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Typography, Button, FormControlLabel, Switch, Grid } from '@material-ui/core';
import Table from 'mui-datatables';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Link } from 'react-router-dom';

import { setShowFullValues } from '../../redux/dataFilter';
import { ReduxState } from '../../redux';
import { dataFormatters } from '../../utils/dataTransform';
import { tableHeaders } from '../../utils/constants';
import { generateKey } from '../../utils/storage';
import { datePresets, formatCustomDate, getDisplayDate } from '../../utils/dates';
import { reportQueries } from '../../graphql/clients';
import useCachedQuery from '../../hooks/useCachedQuery';
import { generateHeaders, getQueryVariables, sortTable } from './utils';
import DateFilters from '../FilterToolbars/DateFilters';
import PlatformFilters from '../FilterToolbars/PlatformFilters';
import Summary from './Summary';
import ClientFilter from './ClientFilter';

interface StyleProps {
  showFullValues: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: 0,
      paddingTop: theme.spacing(2)
    },
    title: {
      marginBottom: theme.spacing(3)
    },
    box: {
      [theme.breakpoints.down(375)]: {
        flexDirection: 'column'
      }
    },
    cell: ({ showFullValues }: StyleProps) => (showFullValues ? { color: 'rgba(0, 0, 0, 0.87)' } : {}),
    greenCell: {
      // @ts-ignore
      color: theme.palette.success.main
    },
    redCell: {
      // @ts-ignore
      color: theme.palette.error.main
    },
    addClientButton: {
      marginLeft: 'auto',
      textDecoration: 'none',
      [theme.breakpoints.down(375)]: {
        margin: `${theme.spacing(1)}px 0`
      }
    },
    tableTitle: {
      fontSize: '1rem',
      color: 'rgba(0, 0, 0, 0.75)'
    }
  })
);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const dataFilter = useSelector((state: ReduxState) => state.dataFilter);
  const classes = useStyles({ showFullValues: dataFilter.showFullValues });
  const history = useHistory();

  const { data, isLoading, hasError } = useCachedQuery({
    name: generateKey(dataFilter),
    ignoreCache: dataFilter.datePreset === 'Custom',
    queryArgs: {
      query: reportQueries[dataFilter.platform],
      key: 'clients',
      defaultValue: [],
      options: {
        variables: getQueryVariables(dataFilter),
        skip: dataFilter.datePreset === 'Custom' && !dataFilter.applyCustomDate
      }
    }
  });

  const headers = useMemo(() => {
    return generateHeaders(tableHeaders[dataFilter.platform], classes);
  }, [classes, dataFilter.platform]);

  const formattedData = useMemo(() => {
    return hasError? [] : dataFormatters[dataFilter.platform](data, dataFilter.showFullValues);
  }, [data, dataFilter.platform, dataFilter.showFullValues, hasError]);

  const dates = dataFilter.datePreset === 'Custom' ? formatCustomDate(dataFilter) : datePresets[dataFilter.datePreset]();

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setShowFullValues(e.target.checked));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography component="h1" variant="h3" className={classes.title}>
              Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Link to="/clients/add-client" className={classes.addClientButton}>
              <Button variant="outlined" color="secondary" startIcon={<PersonAddIcon />}>
                Add Client
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <PlatformFilters />
      </Grid>
      <Grid item xs={12}>
        <DateFilters />
      </Grid>
      <ClientFilter />
      <Grid item xs={12}>
        <Summary platform={dataFilter.platform} isLoading={isLoading} hasError={hasError} data={data} />
      </Grid>
      <Grid item xs={12}>
        <Table
          title={
            <span className={classes.tableTitle}>
              <strong>{`${getDisplayDate(dates.startDate)} - ${getDisplayDate(dates.endDate)}`}</strong> vs Last Year
            </span>
          }
          data={formattedData}
          columns={headers}
          // @ts-ignore
          options={{
            selectableRows: 'none',
            print: false,
            search: false,
            filter: false,
            elevation: 1,
            responsive: 'scrollMaxHeight',
            rowsPerPage: 25,
            rowsPerPageOptions: [],
            textLabels: {
              body: {
                noMatch: isLoading ? 'Loading clients, this may take a few minutes' : 'Sorry, no matching records found'
              }
            },
            customSort: (data, col, order) => sortTable(data, col, order),
            onRowClick: data => {
              history.push(`/clients/${data[0]}/`);
            },
            customToolbar: () => (
              <FormControlLabel
                control={<Switch checked={dataFilter.showFullValues} onChange={handleToggleChange} value="showFullValues" />}
                label="Show Full Values"
                labelPlacement="start"
              />
            )
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
