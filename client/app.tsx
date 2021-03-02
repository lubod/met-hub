import React from 'react';
import Callback from './callback';
import { Route, withRouter } from 'react-router-dom';
import { HomePage } from './homepage';
import './style.scss';

function App(props: any) {
  const authenticated = props.auth.isAuthenticated();

  console.info('App render', authenticated);
  return (
    <div className="App">
      <Route exact path='/callback' render={() => (
        <Callback auth={props.auth} />
      )} />
      <Route exact path='/' render={() => (
        <HomePage
          authenticated={authenticated}
          auth={props.auth}
          history={props.history}
        />)
      } />
    </div>
  );
}

export default withRouter(App);

