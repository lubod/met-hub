import React from 'react';
import './style.scss';
import { Protected } from './protected';
import Callback from './callback';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

function HomePage(props: any) {
  const { authenticated } = props;

  const logout = () => {
    props.auth.logout();
    props.history.push('/');
  };

  if (authenticated) {
    const { name } = props.auth.getProfile();
    return (
      <Protected />
    );
  }
  window.location.replace('https://met-hub.auth.eu-central-1.amazoncognito.com/login?client_id=vn2mg0efils48lijdpc6arvl9&response_type=code&scope=aws.cognito.signin.user.admin&redirect_uri=https://www.met-hub.com/callback');
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

