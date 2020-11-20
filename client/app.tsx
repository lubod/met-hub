import React from 'react';
import './style.scss';
import Protected from './protected';
import Callback from './callback';
import { Route, withRouter } from 'react-router-dom';
import Iframe from 'react-iframe';

function HomePage(props: any) {
  const { authenticated } = props;

  const logout = () => {
    props.auth.logout();
    props.history.push('/');
  };

  if (authenticated) {
    const { name } = props.auth.getProfile();
    return (
      <div>
        <Protected auth={props.auth} />
      </div >
    );
  }
  props.auth.login();
  return (
    <div className='h4 text-warning text-center'>
      Not authenticated: redirecting ...
    </div >
  );
}

function App(props: any) {
  const authenticated = props.auth.isAuthenticated();

  console.log('App', authenticated);
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

