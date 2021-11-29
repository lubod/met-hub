import React, { useContext } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Callback from './callback';
import HomePage from './homepage';
import './style.scss';
import { AppContextP } from '.';

const App = function () {
  const appContext = useContext(AppContextP);

  console.info('App render', appContext.auth.isAuthenticated());
  return (
    <div className="App">
      <Route
        exact
        path="/callback"
        render={() => (
          <Callback />
        )}
      />
      <Route
        exact
        path="/"
        render={() => (
          <HomePage />
        )}
      />
    </div>
  );
};

export default withRouter(App);
