import React from 'react';
import './style.scss';
import Protected from './protected';
import Callback from './callback';
import { Route, withRouter } from 'react-router-dom';
import Socket from './socket';
import { StationController } from './controllers/station-controller';
import { DomModel, StationModel } from './models/model';
import { DomController } from './controllers/dom-controller';

function HomePage(props: any) {
  const { authenticated } = props;
  console.info('Homepage render');

  const logout = () => {
    props.auth.logout();
    props.history.push('/');
  };

  if (authenticated) {
    const { name } = props.auth.getProfile();
    const socket = new Socket();
    console.info('station model init');
    let stationModel = new StationModel();
    const stationController = new StationController(stationModel, props.auth, socket);
    let domModel = new DomModel();
    const domController = new DomController(domModel, props.auth, socket);

    return (
      <div>
        <Protected auth={props.auth} stationModel={stationModel} domModel={domModel}/>
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

