import React, { useContext } from 'react';
import { withRouter } from 'react-router';
import { AppContextP } from '.';

type CallbackData = {
  history: any,
}

const Callback = function ({ history }: CallbackData) {
  console.info('Callback render');
  const appContext = useContext(AppContextP);
  appContext.auth.handleAuthentication().then(() => {
    //        console.info(props.auth.isAuthenticated());
    appContext.auth.handleProfile().then(() => {
      history.push('/');
    });
  });

  //    console.log('Callback');
  return (
    <div className="text-center text-info h4">
      Authenticate ...
    </div>
  );
};

export default withRouter(Callback);
