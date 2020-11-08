import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import Auth from './auth';

const auth = new Auth();

function render() {
  const appContainer = document.getElementById('app');
  ReactDOM.render(
    <BrowserRouter>
      <App auth={auth} />
    </BrowserRouter >,
    appContainer);
}

render();

if (module.hot) {
  module.hot.accept('./App', render);
}
