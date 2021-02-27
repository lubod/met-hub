import React from 'react';
import './style.scss';
import Protected from './protected';
import Callback from './callback';
import { Route, withRouter } from 'react-router-dom';
import Socket from './socket';
import { DomModel } from './models/model';
import { DomController } from './controllers/dom-controller';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Station } from './modules/station/station';

function HomePage(props: any) {
  const { authenticated } = props;
  console.info('Homepage render');

  const logout = () => {
    props.auth.logout();
    props.history.push('/');
  };

  const socket = new Socket();

  if (authenticated) {
    const { name } = props.auth.getProfile();
    //    console.info('station model init');
    //    let stationModel = new StationModel();
    //    const stationController = new StationController(stationModel, props.auth, socket);
    let domModel = new DomModel();
    const domController = new DomController(domModel, props.auth, socket);

    return (
      <Protected auth={props.auth} domModel={domModel} socket={socket} />
    );
  }

  return (
    <Container className='container-max-width text-center py-2'>
      <Row>
        <Col sm={6} className='px-2'>
          <Station socket={socket} />
        </Col>
        <Col sm={6} className='px-2'>
          <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
            <h1 className='text-info'>met-hub.com</h1>
            <p>This is a free side for non-professional meteorological stations.
            Currenly you can see data from GoGEN ME 3900</p>
          </Container >
          <Container className='text-center text-light my-2 py-2 mx-auto border-secondary bg-very-dark rounded'>
            <p>Login to see more stations and historical data</p>
            <Button variant='primary' onClick={props.auth.login}>Login</Button>
          </Container >
        </Col>
      </Row>
    </Container >
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

