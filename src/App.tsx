import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';

import BanksProvider from './contexts/Banks';
import BasisCashProvider from './contexts/BasisCashProvider';
import ModalsProvider from './contexts/Modals';

import Banks from './views/Banks';
import Home from './views/Home';
import Bond from './views/Bond';

import store from './state';
import theme from './theme';
import config from './config';
import Updaters from './state/Updaters';
import Boardroom from './views/Boardroom';
import Popups from './components/Popups';
import WhiteList from './views/WhiteList';
import Governance from './views/Governance';
import Robot from './views/Robot';
import RobotPage from './views/Robot';


const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/fbc">
            <Banks />
          </Route>
          <Route path="/fbs">
            <Banks />
          </Route>
          <Route path="/bank">
            <Banks />
          </Route>
          <Route path="/bonds">
            <Bond />
          </Route>
          <Route path="/boardroom">
            <Boardroom />
          </Route>
          <Route path="/whitelist">
            <WhiteList />
          </Route>
          <Route path="/governance">
            <Governance />
          </Route>
          <Route path="/robot">
            <RobotPage />
          </Route>
        </Switch>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={config.chainId}>
        <Provider store={store}>
          <Updaters />
          <BasisCashProvider>
            <ModalsProvider>
              <BanksProvider>
                <>
                  <Popups />
                  {children}
                </>
              </BanksProvider>
            </ModalsProvider>
          </BasisCashProvider>
        </Provider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

export default App;
