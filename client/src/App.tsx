import React, { lazy } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import { BASE_URL } from './utils/constants';
import store from './redux';
import theme from './styles/theme';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

const ClientForm = lazy(() => import('./components/ClientForm'));
const ClientPage = lazy(() => import('./components/ClientPage'));

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: `${BASE_URL}/api`,
  credentials: 'include',
  cache
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Dashboard} />
            <ProtectedRoute exact path="/clients/add-client" component={ClientForm} />
            <ProtectedRoute path="/clients/:id" component={ClientPage} />
          </Layout>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
