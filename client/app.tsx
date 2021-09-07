import React, { useContext } from 'react';
import Callback from './callback';
import { Route, withRouter } from 'react-router-dom';
import { HomePage } from './homepage';
import './style.scss';
import { AppContextP } from '.';

function App(props: any) {
  const appContext = useContext(AppContextP);

  console.info('App render', appContext.auth.isAuthenticated());
  return (
    <div className="App">
      <Route exact path='/callback' render={() => (
        <Callback />
      )} />
      <Route exact path='/' render={() => (
        <HomePage
          history={props.history} />)
      } />
    </div>
  );
}

export default withRouter(App);

